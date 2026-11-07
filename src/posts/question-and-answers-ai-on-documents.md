---
title: "Question and Answer AI on Documents."
date: 2023-06-11T11:01:11Z
categories: [artificial-intelligence, essays, technology]
---

I am writing these notes as I learn more about creating a question and answer system for a custom set of PDFs. This is an incredible useful use case for LLM (Large Language Models), and while there are plenty of commercial offerings online, many corporate policies do not allow end users to upload sensitive internal data to these third-party systems.

So can we build something that leverages OpenAI’s GPT capabilities, but does not store data on third-party systems but works with a local index?

The high level methodology is quite straight-forward:

1.  Extract the text of one or more PDFs, either by paragraph or perhaps in 500 or 1,000 word chunks.
2.  Create high-dimensional vector embeddings of each of these chunks. This essentially turns them into a bunch of numbers that represent the meaning of each paragraph, and that can be graphed out.
3.  Store these embeddings somewhere they can be searched and compared.
4.  Take a user query, also run the embeddings, and then find the nearest *x* chunks that match with regards to semantic meaning.
5.  Submit the user query, plus the context to a LLM, and get back the answer.

For this project, I have identified the following libraries that I will use:

-   **PyPDF2:** A library for PDF manipulation in Python, which allows one to extract text, split, merge, and perform various operations on PDF documents.
-   **OpenAI:** An AI platform offering powerful language models and NLP capabilities, which we can leverage for tasks like generating answers to user queries based on context.
-   **Faiss:** A library designed for efficient similarity search and clustering, particularly useful for large-scale datasets. We can use it to create high-dimensional vector embeddings of text chunks and perform similarity searches to find nearest matches.
-   **Streamlit:** A Python framework for building interactive web applications and data visualizations. It can be employed to create a user-friendly interface for this question and answer system, allowing users to input queries and displaying the generated answers.

## Step 1: Text Extraction.

So let’s tackle the first step, which is extracting the text from the PDF in 500 word chunks, and then storing that in a list.

```
import PyPDF2

# Extract text from a PDF file in 500-word chunks
def extract_text_from_pdf(pdf_file):
    # Read the PDF file
    with open(pdf_file, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        # Get the number of pages in the PDF
        num_pages = len(pdf_reader.pages)
        # Initialize an empty list to store the text chunks
        text_chunks = []
        # Loop through each page and extract the text
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            # Extract the text from the page
            page_text = page.extract_text()
            # Split the text into individual words
            words = page_text.split()
            # Iterate over words and create 500-word chunks
            for i in range(0, len(words), 500):
                # Get a chunk of 500 words
                chunk = ' '.join(words[i:i+500])
                # Append the chunk to the text_chunks list
                text_chunks.append(chunk)
    # Return the list of text chunks
    return text_chunks
```

Then I simply set the PDF that I want to process:

```
text_chunks = extract_text_from_pdf("sample.pdf")
```

And then to test that this is working, I can try to print a specific chunk into the terminal:

```
print(text_chunks[10])
```

This will the 11th chunk (as the index starts at 0).

And this works!

![](/media/2023/06/kfcdCRtu@2x.png)

So what are our next steps?

## Step 2: Create Embeddings.

For each chunk, we need to create an embedding using OpenAI’s embeddings endpoint.

This is the code taken from [OpenAI’s cookbook:](https://github.com/openai/openai-cookbook/blob/main/examples/Get_embeddings.ipynb)

```
import openai

embedding = openai.Embedding.create(
    input="Your text goes here", model="text-embedding-ada-002"
)["data"][0]["embedding"]
len(embedding)
```

But we need to do this for every one of the chunks that we created earlier, thus we need to loop through the chunks we created earlier.

```
import openai

# List of text chunks from PDFs
text_chunks = extract_text_from_pdf("sample.pdf")

# Embedding for each text chunk
embeddings = []
for chunk in text_chunks:
    embedding = openai.Embedding.create(
        input=chunk, model="text-embedding-ada-002"
    )["data"][0]["embedding"]
    embeddings.append(embedding)
```

As a test that this is working, we can print out the number of chunks that have been embedded:

```
# Print the total number of processed chunks
num_chunks_processed = len(text_chunks)
print("Number of Chunks Processed:", num_chunks_processed)
```

Let’s test that this is working!

![](/media/2023/06/BOqaAPe2@2x.png)

And yes, we are getting the return of a specific chunk as before, and also the number of chunks that we have embedded. In this case, 26 chunks.

For a further check, we can also write all the actual embeddings into a text file as a test:

```
# Save embeddings to a text file
with open("embeddings.txt", "w") as file:
    for embedding in embeddings:
        file.write(" ".join(str(value) for value in embedding))
        file.write("\n")
```

And that also works well:

![](/media/2023/06/g9MOPpMZ@2x.png)

*It is quite incredible to think that these lists of coordinates are actually representing real text and meaning!*

So as a reminder, we have now managed to do the first two steps of our methodology:

1.  Extract the text of one or more PDFs, either by paragraph or perhaps in 500 or 1,000 word chunks.
2.  Create high-dimensional vector embeddings of each of these chunks. This essentially turns them into a bunch of numbers that represent the meaning of each paragraph, and that can be graphed out.

## Step 3: Store Embeddings.

The next step is to store these embeddings somewhere they can be searched and compared. This is where the [Faiss](https://faiss.ai/) (Facebook AI Similarity Search) library comes in.

We can use this to loop through our embeddings list that contains all of our vectorized chunks and then save them into a index that we can use for search later.

So the first thing here is to convert the embeddings to a Numpy array. By converting the embeddings to a NumPy array, we ensure that the data is in the correct format expected by Faiss. Faiss provides an interface that works seamlessly with NumPy arrays, allowing for easy indexing, search, and comparison operations.

The code is rather straight-forward:

```
# Convert the embeddings to a NumPy array
embeddings_array = np.array(embeddings)
```

There is an optional step here to normalize the data:

```
# Normalize the embeddings to unit length
embeddings_array = embeddings_array / np.linalg.norm(embeddings_array, axis=1, keepdims=True)
```

I am not 100% sure if this is required or not in this case, but I will make tests.

We can then create an index and save the data to it.

```
# Create an index for the embeddings using faiss.IndexFlatIP
index = faiss.IndexFlatIP(embeddings_array.shape[1])  # Inner product distance metric
index.add(embeddings_array)

# Save the index to a file
index_file = "embeddings.index"
faiss.write_index(index, index_file)
```

When creating an index in Faiss, we have a couple of options:

1.  **faiss.IndexFlatL2:** This is a simple index that uses the L2 (Euclidean) distance metric. It is suitable for general-purpose similarity search and works well when the dimensionality of the embeddings is not extremely high.
2.  **faiss.IndexFlatIP:** This index uses the inner product (dot product) as the distance metric. It is useful when the embeddings are normalized and the similarity search is based on cosine similarity.

Because we are using OpenAI embeddings which have 1536 dimensions, **faiss.IndexFlatIP** is better because we can leverage similarity search based on cosine similarity.

I tried to run this, and I saw that a file was saved in my folder called “embeddings.index” which is the expected behaviour.

We can try some other verifications to ensure that this is working correctly:

```
# Verify index has been written correctly
loaded_index = faiss.read_index(index_file)

# Check index size
index_size = loaded_index.ntotal
print("Index size:", index_size)

# Retrieve a random embedding from the index
random_embedding_index = np.random.randint(index_size)
random_embedding = loaded_index.reconstruct(random_embedding_index)
print("Random embedding:")
print(random_embedding)
```

We can then check that the number of chunks embedded and the number of items in the index matches, and that we get back a random embedding:

![](/media/2023/06/LTFTaqrp@2x.png)

Perfect! So that’s step 3 done — let’s keep going!

## Step 4: User Query and Matching.

As a reminder, we now have to take a user query, also run the embeddings, and then find the nearest *x* chunks that match with regards to semantic meaning.

Let’s get a user query on the terminal:

```
# Obtain the user question from the terminal
user_question = input("Enter your question: ")

# Print the user question
print("User Query:", user_question)
```

And we can also print that back to the user so they know what they asked.

We then vectorize this user question in the same manner we did previously:

```
# Vectorize user question
user_query_embedding = openai.Embedding.create(
    input=user_query, model="text-embedding-ada-002"
)["data"][0]["embedding"]
```

We then find the nearest matches on our index:

```
k = x  # Number of nearest neighbours to retrieve
distances, indices = loaded_index.search(np.array([user_query_embedding]), k)
```

And then we can return and print these out as a test:

```
nearest_chunks = [text_chunks[index] for index in indices[0]]
for chunk in nearest_chunks:
    print(chunk)
```

I used a project document from UNDP about a reconstruction project in Iraq as a test, and I’ve highlighted my question and also the response:

![](/media/2023/06/Uiyx0ocm@2x.png)

This is extremely promising, because the system returned the correct chunk of the document required to answer my question! That’s step 4 done, now let’s try and get some answers in Natural Language.

## Step 5: Prompt & Response.

So now we are onto the final step. We need to submit the user query, plus the context to a LLM, and get back the answer.

This is the typical format for submitting a query to GPT4

```
messages = [
        {'role': 'system', 'content': 'INSERT SYSTEM PROMPT'},
        {'role': 'user', 'content': INSERT USER QUESTION},
        {'role': 'user', 'content': 'INSERT CONTEXT'},
    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=messages,
        temperature=0.2,
        max_tokens=2000
    )
```

I’ve put max tokens to be a generous 2000 for the answer.

So let’s format this as a function. [First thing is to add a system prompt as shown in the OpenAI Docs](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api). I’ve gone for *“You are a system that answer user questions based on excerpts from PDF documents that are provided for context. You must only answer the question if the answer can be found in the provided context. Do not make up the answer, and if you cannot find the answer in the context just say that you cannot find the answer”*

But I am sure that we can iterate on this in the future to improve how the system works, but it’s good enough for now.

We also add the user\_question and context as nearest\_chunk. However, we need to do a little bit of work on the chunks, as this is currently a Python list.

To pass this list as the content for the user context message, we need to join these strings together and separate them with newline characters (`'\n'`).

The line `'\n'.join(nearest_chunks)` achieves this by joining the strings in the `nearest_chunks` list using `'\n'` as the separator. This results in a single string where each chunk is separated by a newline character. By doing this, we ensure that the user context message accurately represents the chunks of text in a format that the GPT-4 model can understand.

```
# Convert chunks to strings
nearest_chunks_strings = [str(chunk) for chunk in nearest_chunks]

# Join chunks with newline characters
user_context_content = '\n'.join(nearest_chunks_strings)
```

And now we can create our function to send GPT4 the user question and context:

```
def get_answer_from_gpt4(user_question, nearest_chunks):
    system_prompt = "You are a system that answer user questions based on excerpts from PDF documents that are provided for context. You must only answer the question if the answer can be found in the provided context. Do not make up the answer, and if you cannot find the answer in the context just say that you cannot find the answer"
    messages = [
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': user_question},
        {'role': 'user', 'content': '\n'.join(nearest_chunks)},
    ]

    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=messages,
        temperature=0.2,
        max_tokens=2000
    )
```

And then let’s see what the response is.

```
# Get the response from GPT-4
response = get_answer_from_gpt4(user_question, user_context_content)
```

Success! We get this:

```
User Query: what is the development goals for this project?
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The development goals for this project are to achieve significant progress in six key areas: \n\n1. Increasing access to potable water in urban areas\n2. Increasing sewage treatment and access to urban sewerage systems\n3. Increasing solid waste collection and disposal\n4. Raising access to potable water in rural areas\n5. Increasing sanitation services in rural areas\n6. Contributing towards efficiency improvement of the public management systems in Iraq.",
        "role": "assistant"
      }
    }
  ],
  "created": 1686479251,
  "id": "chatcmpl-7QCaBEf56X30jnX2OPhojdBYF88zR",
  "model": "gpt-4-0314",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 88,
    "prompt_tokens": 2719,
    "total_tokens": 2807
  }
}
```

But we actually only want the “content” part of this response, and that becomes our answer, so we can do:

```
# Extract the assistant's message content from the response
answer = response['choices'][0]['message']['content']

# Print the assistant's message
print(answer)
```

Which will just give us the answer only, nicely formatted:

![](/media/2023/06/BKlQVmSe@2x.png)

And that’s it, this is now working! It feels pretty awesome to have been able to get this far, but why do we take it a step further and build out a user interface for this, and allow users to upload documents?

This is actually quite straight-forward with Streamlit. We import the streamlit library (*import streamlit)* and then just add this to the end of the script:

```
st.title("PDF Question Answering App")

pdf_file = st.file_uploader("Please upload a PDF document", type=['pdf'])

if pdf_file is not None:
    text_chunks = extract_text_from_pdf(pdf_file)
    embeddings = create_embeddings(text_chunks)
    index_file = create_faiss_index(embeddings)
    user_question = st.text_input("Enter your question: ")

    if user_question:
        answer = get_answer_from_faiss_and_gpt4(user_question, text_chunks, index_file)
        st.write("**Answer:** " + answer)
```

And then when we run the app we get:

![](/media/2023/06/cu0ghDLC@2x.png)

This is really not bad for a couple of hours of work, and I can imagine tons of scenarios where searching through a corpus of text and asking questions can be really useful.

You can find the entire code here, which includes some of the testing elements that I discuss as we went along this journey, those can be easily removed if required.

```
import streamlit as st
import openai
import PyPDF2
import faiss
import numpy as np

openai.api_key = 'YOUR OPENAI Key' # Or store as an env variable

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text_chunks = []
    num_pages = len(pdf_reader.pages)
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        page_text = page.extract_text()
        words = page_text.split()
        for i in range(0, len(words), 500):
            chunk = ' '.join(words[i:i+500])
            text_chunks.append(chunk)
    return text_chunks

def create_embeddings(text_chunks):
    embeddings = []
    for chunk in text_chunks:
        embedding = openai.Embedding.create(
            input=chunk, model="text-embedding-ada-002"
        )["data"][0]["embedding"]
        embeddings.append(embedding)
    return np.array(embeddings)

def create_faiss_index(embeddings_array):
    index = faiss.IndexFlatIP(embeddings_array.shape[1])  # Inner product distance metric
    index.add(embeddings_array)
    index_file = "embeddings.index"
    faiss.write_index(index, index_file)
    return index_file

def get_answer_from_faiss_and_gpt4(user_question, text_chunks, index_file):
    loaded_index = faiss.read_index(index_file)
    user_query_embedding = openai.Embedding.create(
        input=user_question, model="text-embedding-ada-002"
    )["data"][0]["embedding"]
    k = 5  # Number of nearest neighbours to retrieve
    distances, indices = loaded_index.search(np.array([user_query_embedding]), k)
    nearest_chunks = [text_chunks[index] for index in indices[0]]
    user_context_content = '\n'.join(str(chunk) for chunk in nearest_chunks)
    response = get_answer_from_gpt4(user_question, user_context_content)
    return response['choices'][0]['message']['content']

def get_answer_from_gpt4(user_question, user_context_content):
    system_prompt = "You are a system that answer user questions based on excerpts from PDF documents that are provided for context. You must only answer the question if the answer can be found in the provided context. Do not make up the answer, and if you cannot find the answer in the context just say that you cannot find the answer"
    messages = [
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': user_question},
        {'role': 'user', 'content': user_context_content},
    ]

    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=messages,
        temperature=0.2,
        max_tokens=2000
    )
    return response

st.title("PDF Question Answering App")

pdf_file = st.file_uploader("Please upload a PDF document", type=['pdf'])

if pdf_file is not None:
    text_chunks = extract_text_from_pdf(pdf_file)
    embeddings = create_embeddings(text_chunks)
    index_file = create_faiss_index(embeddings)
    user_question = st.text_input("Enter your question: ")

    if user_question:
        answer = get_answer_from_faiss_and_gpt4(user_question, text_chunks, index_file)
        st.write("**Answer:** " + answer)
```
