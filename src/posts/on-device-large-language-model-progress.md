---
title: "On-Device Large Language Model Progress."
date: 2023-03-18T07:25:24Z
categories: [artificial-intelligence, essays]
---

Since GPT3 was made available in November 2022, I can feel the acceleration of progress in AI.

It feels that every day there are new innovative tools and approaches. However, almost all of them are based on the APIs provided by OpenAI, and this was showcased clearly when OpenAI went down for half a day and almost all of the “AI” startups were also down.

Perhaps I am not being generous enough to these startups. After all, providing a solid consumer or business front-end to the GPT APIs is itself a great value add, and there is a lot of possible innovation in this space.

I have used Stable Diffusion, the image generation model, via the easy-to-use DiffusionBee for around six months. It made me smile that I could do the same thing as DALL·E from OpenAI (their image generation AI system) but offline and completely free.

This gave me hope for democratising generative systems and that anyone could run these on consumer-level hardware.

Anyone can generate images from text prompts on their own hardware in just a few seconds without any limitations imposed by third parties. Obviously, this does not only have positives, there are also negative consequences. You can use Stable Diffusion to generate child pornography, but that is a completely separate subject and an interesting discussion in its own right.

After all, it is not illegal to *think* about child pornography, and it is not illegal to make a pencil stick-like sketch of child porn. At what level of fidelity does a drawing become illegal? And what if the drawing is made on a computer instead of by hand?

Where do we draw the line here? And excuse the terrible pun.

It is somewhat surprising that language models such as GPT-3, which power tools such as ChatGPT, are larger and more costly to construct and maintain than image generation models. The most advanced of these models have been constructed primarily by private organizations like OpenAI and have been kept under tight control – accessible through their API and web interfaces but not released for individual use on personal computers.

These models are extremely large and complex. Even if you could procure a GPT-3 model, it would be not easy to run it on standard hardware due to the need for several A100-class GPUs, each priced at $8,000+.

It would be amazing if there were something out there that is easy to run on my MacBook, powerful enough to be helpful, and open-source so that it can be modified and that it is also freely available (in both meanings of the word “free”).

It turns out that this is already now possible! See a quick screen recording below from my Macbook, running an LLM offline:

<figure><video src="/media/2023/03/llama-alpaca-model-recording-1.mp4" width="1920" height="1292" controls="" preload="metadata" playsinline=""></video></figure>

This is just the early days, but what can be done is already amazing. Imagine how useful this could be for people in emergencies or in the field, where they need to be able to look up key information without being able to access the internet!

So let me explain what you see in the video.

Facebook recently released [LLaMA](https://research.facebook.com/publications/llama-open-and-efficient-foundation-language-models/):

> a collection of foundation language models ranging from 7B to 65B parameters. We train our models on trillions of tokens, and show that it is possible to train state-of-the-art models using publicly available datasets exclusively, without resorting to proprietary and inaccessible datasets. In particular, LLaMA-13B outperforms GPT-3 (175B) on most benchmarks, and LLaMA-65B is competitive with the best models, Chinchilla70B and PaLM-540B.

However, this was only available to researchers, and you had to apply for access. The license agreement is quite restrictive, and in general, it is mostly meant for researchers to use in their testing, not for commercial products.

Of course, this is the internet age, and these models did not stay private for very long. [Someone made a very funny PR to the Github repository](https://github.com/facebookresearch/llama/pull/73) that included the link to the models available on BitTorrent.

I checked those out, but the download was 240+GB, which is about the same amount of disk space I own on my laptop.

That would not be the only problem, as the LLaMA model is not fine-tuned for answering questions. Facebook admits as such on their FAQ:

> Keep in mind these models are not finetuned for question answering. As such, they should be prompted so that the expected answer is the natural continuation of the prompt.
>
> Here are a few examples of prompts geared towards finetuned models, and how to modify them to get the expected results:
>
> Do not prompt with “What is the meaning of life? Be concise and do not repeat yourself.” but with “I believe the meaning of life is”
>
> Do not prompt with “Explain the theory of relativity.” but with “Simply put, the theory of relativity states that”
>
> Do not prompt with “Ten easy steps to build a website…” but with “Building a website can be done in 10 simple steps:\\n”
>
> To be able to directly prompt the models with questions / instructions, you can either:
>
> Prompt it with few-shot examples so that the model understands the task you have in mind.
>
> Finetune the models on datasets of instructions to make them more robust to input prompts.

This big innovation at OpenAI made GPT accessible to the general public. [They trained their models to follow instructions](https://openai.com/research/instruction-following), making the entire experience more… human!

## Model Extraction: How This Changes Everything.

What the Stanford team did could change the entire industry of text generation.

Previously, the idea was that a company’s model was its competitive moat. OpenAI keeps its model secret and only available via an API and web interface. It was imagined that this would be very difficult to replicate without spending millions to collect the data and train.

There are estimates that training GPT3 would cost between $4.6M and $12M — hardly something an everyday person could do.

Just six weeks ago, [ARK Invest](https://ark-invest.com/) put out a [paper on big ideas for 2023](https://research.ark-invest.com/hubfs/1_Download_Files_ARK-Invest/Big_Ideas/ARK%20Invest_013123_Presentation_Big%20Ideas%202023_Final.pdf) and their prediction for the price decrease of training a GPT-3 like model:

<figure><img src="/media/2023/03/Screenshot-2023-03-18-at-8.30.52-AM.png" alt="" width="750" height="358" loading="lazy"><figcaption>The expected decrease in AI training costs.</figcaption></figure>

They predicted that the $4.6M cost of training a GPT-3 like model would take until 2030 to fall to something as insignificant as $30.

**What has happened in reality is that 99% of this cost reduction has happened within *five weeks* of this prediction being published — not eight years.**

More importantly, it is *how* the Stanford team fine-tuned their model.

They recruited GPT3.5 to train their LLaMA 7B model, using self-instruct with *text-davinci-003* OpenAI API.

What is even funnier is that had they waited a few days, the ChatGPT API would have come out, which is even cheaper, and it would have reduced their fine-tuning cost 10x again!

Why is this important? It is because one advanced model is training another model, which means there may not be any competitive moat to having a huge model. After all, others may be able to “extract” the model by running a rather trivial amount of queries.

Fine-tuning is computationally cheap but rests on proprietary data that are expensive to produce, so this was supposed to be the moat. What we have learned is that this competitive moat can be cheaply stolen.

## Running This On A Macbook.

I knew I wanted to get this running on a Macbook, and once the LLaMA model was leaked publicly, it was only a matter of time until [someone](https://crfm.stanford.edu/2023/03/13/alpaca.html) made this happen.

> We introduce Alpaca 7B, a model fine-tuned from the LLaMA 7B model on 52K instruction-following demonstrations. Alpaca behaves similarly to OpenAI’s text-davinci-003, while being surprisingly small and easy/cheap to reproduce (<600$)

The team at Stanford was able to fine-tune the model with just 52K instructions, and they used OpenAI’s GPT3 to do this!

Then, [someone](https://github.com/ggerganov/llama.cpp) made a port to C++ which made the whole thing more efficient, and the rest quickly followed.

So now we have a mixture of [Facebook’s LLaMA](https://github.com/facebookresearch/llama), [Stanford Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html), [alpaca-lora](https://github.com/tloen/alpaca-lora) and [corresponding weights](https://huggingface.co/tloen/alpaca-lora-7b/tree/main) by Eric Wang (which uses [Jason Phang’s implementation of LLaMA](https://github.com/huggingface/transformers/pull/21955) on top of Hugging Face Transformers), and [llama.cpp](https://github.com/ggerganov/llama.cpp) by Georgi Gerganov. The chat implementation is based on Matvey Soloviev’s [Interactive Mode](https://github.com/ggerganov/llama.cpp/pull/61) for llama.cpp. 

You can find the Github repo [here](https://github.com/antimatter15/alpaca.cpp) — but I will talk you through the steps of installing this on a Macbook. This will work best with M1/M2 Apple Silicon and at 8GB RAM, but I have heard that 4GB of RAM is also okay.

Firstly, download the 7B model. This model is compressed to only 4GB file with 4-bit quantization. This is far better than trying to download all the models (240GB+!) via the torrent link I mentioned earlier. I have heard that the 13B model is the sweet spot of performance and resource usage, but I have not tried that out yet.

```
# any of these will work
wget -O ggml-alpaca-7b-q4.bin -c https://gateway.estuary.tech/gw/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC
wget -O ggml-alpaca-7b-q4.bin -c https://ipfs.io/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC
wget -O ggml-alpaca-7b-q4.bin -c https://cloudflare-ipfs.com/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC
```

You can use wget or simply copy and paste of of these links into your browser to start the download.

Clone the repository, or simply download the repository from Gitub into a folder on your desktop

```
git clone https://github.com/antimatter15/alpaca.cpp
```

Make sure both the model and Alpaca are in the same folder.

Run this in your terminal:

```
make chat
./chat
```

**Done — you can now generate GPT3-level text on your computer, offline.**
