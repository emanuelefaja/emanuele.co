---
title: "Leveraging Vector Embeddings in the Development Sector."
date: 2023-05-13T12:02:40Z
categories: [artificial-intelligence, essays, learning]
---

This paper examines the application of AI in achieving the United Nations’ Sustainable Development Goals within the development sector and offers a critical evaluation of the prevailing knowledge management strategies. To address the limitations of existing systems, the paper proposes a novel approach utilising advanced techniques, including vector embeddings, cosine similarity, semantic search, and large language models. These methods can potentially transform knowledge management in the development sector, facilitating more efficient and effective resource utilisation and promoting sustainable development.

## **Novel Knowledge Base Leveraging Vector Embeddings and Cosine Similarities.**

**Defining Knowledge Management.** 

To evaluate semantic search methods in Knowledge Bases (KB), understanding the role of Knowledge Management (KM) is essential. Knowledge is a blend of experiences, information, and insight and provides a framework for evaluating new experiences and information. (Davenport & Prusak, 1998). According to Bhatt (2001), data are raw facts, information is a logical grouping of data with shared meaning, and knowledge is actionable information. Wisdom is knowing *when* and *how* to act. 

KM catalogues knowledge to enhance decision-making and performance (Rowley, 1999). According to Hansen et al. (1999), KM is not a new concept. Organisations have always utilised different KM forms to make decisions, but not deliberately and systematically (Sarvary, 1999).  Alavi and Leidner (1999) describe KB systems as centralised repositories that facilitate the capture, storage, and dissemination of knowledge and expertise for problem-solving and decision-making. KB systems can take various forms, including databases, wikis, and online forums.

![](/media/2023/05/image.png)

**Diagram: Continuum from data to wisdom.** Attribution: (Cong and Pandya, 2003)

**The Importance of Knowledge Management.** 

Dalkir (2013) argues that knowledge management is crucial for any organisation’s long-term success and competitiveness, regardless of industry. It enables organisations to systematically collect, organise, and share knowledge and expertise, creating a culture of learning and innovation. McAdam and Reid (2000) found that effective KM helps organisations identify knowledge gaps, and opportunities and make better-informed decisions while avoiding mistakes. Drucker (1999) argues that an organisation’s value is significantly derived from its staff’s knowledge.  Probst et al. (2018) also emphasise that KM can significantly contribute to organisational growth, sustainability, and impact.  According to the CIO Council (2001), effective knowledge management reduces costs and time associated with trial and error or redundant problem-solving efforts, generating value.

**Current KM Problems in the Development Sector.**

While KM is crucial in the development sector, it also faces significant challenges. The main challenge is sharing knowledge due to the scattered nature of information and the absence of efficient search tools (Serrat, 2017). Numerous stakeholders operating across multiple sectors and regions, combined with the scale and complexity of development organisations, make it challenging to establish consistent knowledge-sharing practices and standards. Cultural and language differences among stakeholders further complicate communication, collaboration, and the effective dissemination of information. These challenges cause duplicated efforts and missed opportunities for innovation.

![](/media/2023/05/image-1.png)

**Diagram: The Complexity and Size of the United Nations System.** (Attribution: un.org, accessed March 2023)

**Introduction to Methodology.**

UNDP, the largest UN agency, has recognised a need for an updated approach to KM and KB. The novel method involves utilising high-dimensional vector embeddings to convert knowledge into vectors. Cosine similarity compares queries against a vector database to locate the closest match. The context of the request and the user query is submitted to an LLM, which responds in natural language.

Sources and confidence scores confirm information accuracy for end users.

Vector embeddings numerically represent text and capture meaning and relationships between text for easy analysis (Bojanowski et al., 2017). They allow NLP models to understand the meaning of words beyond simple keyword matching. Cosine similarity is a powerful tool for analysing relationships between texts, allowing a more nuanced understanding of meaning (Charikar et al., 2002). Semantic search interprets user queries and identifies relevant results based on meaning, context, synonyms, related words, and concepts (Bizer, Heath, & Berners-Lee, 2009). It improves search accuracy and user satisfaction. Large language models analyse relationships between words and generate highly accurate and relevant text using deep learning techniques (Radford, Jozefowiczm, and Sutskever, 2017)

**Data pre-processing.**

Cleaning and preprocessing collected data are crucial for optimal performance and accuracy in semantic search using vector embedding models and cosine similarity measures. Tokenisation segments text into words or tokens, and stopword removal filters out insignificant words.  Lemmatisation reduces words to their base form for efficiency. Special characters, URLs, and email addresses are removed to eliminate noise. Standardising domain-specific abbreviations and acronyms is important, particularly in frequently used fields like development (Antons et al. 2020), for accurate capture of meaning. This step enables accurate capture of the intended meaning and context. Named entity recognition and tagging distinguish between general and specific entities like people, organisations, and locations for better performance. (Salih and Efnan, 2022)

**Creating high-quality vector embeddings.** 

After preprocessing the data, generating vector embeddings involves several considerations to ensure optimal performance and accuracy in semantic search  (Bojanowski et al., 2017). Pennington, Socher, and Manning (2014) argue that embedding techniques like Word2Vec, GloVe, or FastText can impact the quality and granularity of embeddings. Determining appropriate dimensionality for vectors is essential while generating embeddings to balance nuanced semantic relationships with computational complexity and overfitting risks (Goldberg, 2017). Balancing the trade-offs between granularity and computational efficiency is crucial. Generating embeddings at the word, sentence, or paragraph level is another consideration. Word-level embeddings primarily focus on individual words, while sentence-level and paragraph-level embeddings aim to capture broader context and relationships between words within larger units of text ( Devlin et al., 2019). Combining sentence and paragraph embeddings can potentially improve performance in semantic search in a knowledge base by capturing local and global relationships within the text (Kiros et al., 2015). Dividing text into smaller or overlapping chunks captures more contextual information but increases computational demands.

**Matching.**

Several steps are taken when handling user queries to ensure effective processing and matching with the most relevant results. The user query undergoes the same preprocessing and vectorisation techniques as the KB content (Bojanowski et al., 2017). This ensures a comparable form of the query with the embeddings for the knowledge base, considering both local and global relationships within the text (Kiros et al., 2015). Once the user query is transformed into a vector, cosine similarity measures the similarity between the query vector and the KB vectors (Singhal, 2001). The highest cosine similarity scores determine the most relevant results, which are then returned to the user for a more accurate and contextually relevant search experience.

**Processing the user query with context information**

The original non-vectorized user query and the top-ranked paragraphs from the KB are submitted to an LLM like GPT-4 or BERT.  Extensively pre-trained on text data, these state-of-the-art models understand the context and generate coherent, contextually relevant natural language responses.  The LLM processes the user query and selected paragraphs by leveraging its understanding of the underlying semantics and relationships between the text elements. The model generates a natural language answer directly addressing the user’s query by harnessing the context from the top-ranked paragraphs. This approach delivers the answer in a human-like, easily comprehensible manner, ensuring accuracy and enhancing the user experience with a well-informed response.  Providing the entire source document to the LLM as context when submitting a query may be feasible in the future. (Devlin et al., 2019)

**Mitigation and verification steps.**

In the final step, the system provides references for the identified documents and specific paragraphs contributing to the generated answer. Including these references enhances the search experience by enabling users to understand the sources and context behind the response. The system supplies the confidence level of the generated answer based on the cosine similarity scores between the user query and the retrieved paragraphs. This confidence level indicates how well the answer matches the user’s query. The confidence level can also adapt the language used by the LLM when generating the response.  If the confidence level is high, the LLM generates an assertive and definitive answer, while lower confidence levels may lead to more cautious or exploratory responses. Dynamic adjustment based on confidence levels ensures that users receive accurate and contextually appropriate information tailored to the quality of the available data and its relevance to their query.

**Limitations of the methodology.** 

One limitation is the inherent biases present in vector embeddings (Caliskan, Bryson, and Narayanan, 2017). Biases stem from training data’s historical, societal, or cultural factors. This can yield development sector search results lacking diverse perspectives. Models struggle with domain-specific language, jargon, and acronyms. This can lead to suboptimal semantic search results not capturing domain nuances.

Belinkov and Glass (2019) raise a concern of the need for interpretability of vector embedding models, particularly deep learning-based models like BERT and other transformers. This opacity makes it difficult to understand the reasons behind search results, hindering user trust and adoption. Training and fine-tuning require substantial computational and human resources, especially for large knowledge bases. (Strubell, Ganesh, & McCallum, 2019). However, this is counterbalanced by the continuous falling costs of cloud computing. 

Text data in the development sector can be noisy, with variations in writing styles, quality, and language use. Noise may affect the accuracy and reliability of semantic search using vector embeddings and cosine similarity.  Multi-language data poses consistency challenges for vector embeddings, especially for low-resource languages (Ruder et al., 2019). This could limit the applicability for semantic search in a diverse, global context, leading to incomplete or biased results. 

Lastly, when using advanced LLMs, there is a risk of hallucinations, which refers to generating plausible-sounding but incorrect or nonsensical information (Brown et al., 2020). This risk can be mitigated by surfacing the sources used during the search and providing a confidence score based on cosine similarity. This empowers users to make informed decisions by assessing the confidence score and credibility of sources.

## **Conclusion.**

In conclusion, AI holds immense promise for the development sector, offering the potential to accelerate progress towards achieving the SDGs. Nevertheless, it is crucial to remain vigilant of AI implementation’s potential risks and challenges, such as exacerbating the digital divide and perpetuating existing inequalities.

By leveraging advanced vector embeddings and semantic search methodologies, AI can profoundly impact knowledge management in the development sector. These cutting-edge approaches facilitate seamless searching, accessing, and analysing of vast amounts of data, fostering information sharing and collaboration across diverse stakeholders. Improved knowledge management paves the way for enhanced decision-making, bolstering the efficiency and effectiveness of development programs worldwide.

As a result, using AI in knowledge management accelerates progress towards the SDGs and fosters a more equitable and sustainable world for present and future generations. By embracing AI’s transformative potential while carefully mitigating its inherent risks, the development sector can harness the immense power of technology to create lasting, positive change.

## References & Further Reading.

Alavi, M. and Leidner, D.E., 1999. “Knowledge management systems: issues, challenges, and benefits.” *Communications of the Association for Information Systems*, 1(7), pp.1-37.

Antons, D., Grünwald, E., Cichy, P. and Salge, T.O., 2020. “The application of text mining methods in innovation research: current state, evolution patterns, and development priorities.” *R&D Management*, 50(3), pp.329-351.

Belinkov, Y., & Glass, J. (2019). “Analysis Methods in Neural Language Processing: A Survey.” *Transactions of the Association for Computational Linguistics*, 7, pp. 49-72.

Bhatt, G. D. (2001). “Knowledge management in organizations: examining the interaction between technologies, techniques, and people.” *Journal of Knowledge Management*, 5(1), pp. 68-75.

Bishop, C. M. (2006). *Pattern recognition and machine learning.* New York, NY: Springer.

Bizer, C., Heath, T., & Berners-Lee, T. (2009). “Linked data-the story so far.” *International Journal on Semantic Web and Information Systems,* 5(3), 1-22.

Bojanowski, P., Grave, E., Joulin, A., & Mikolov, T. (2017). ‘Enriching word vectors with subword information’. *Transactions of the Association for Computational Linguistics,* 5, pp. 135-146.

Bolukbasi, T., Chang, K. W., Zou, J. Y., Saligrama, V., & Kalai, A. T. (2016). “Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings.” In D. D. Lee, M. Sugiyama, 

U. V. Luxburg, I. Guyon, & R. Garnett (Eds.), Advances in Neural Information Processing Systems 29 (NIPS 2016) (pp. 4349-4357). Curran Associates, Inc.

Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., … & Amodei, D. (2020). “Language models are few-shot learners.” arXiv preprint arXiv:2005.14165.

Caliskan, A., Bryson, J. J., & Narayanan, A. (2017). “Semantics derived automatically from language corpora contain human-like biases.” *Science*, 356(6334), 183-186.

Charikar, M., Chen, K., & Farach-Colton, M. (2002). “Finding frequent items in data streams.” Technical Report, Dept. of Computer Science, Princeton University. Available at: [https://people.cs.rutgers.edu/~farach/pubs/FrequentStream.pdf](https://people.cs.rutgers.edu/~farach/pubs/FrequentStream.pdf) (Accessed: 15th March 2023).

CIO Council, 2001. Managing Knowledge @ Work, An Overview of Knowledge Management. Knowledge Management Working Group of the Federal Chief Information Officers Council, August 2001.

Dalkir, K., 2013. *Knowledge Management in Theory and Practice.* Routledge.

Davenport, T. H., & Prusak, L. (1998). *Working Knowledge: How organizations manage what they know.* Harvard Business Press

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). “BERT: Pre-training of deep bidirectional transformers for language understanding.” In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long and Short Papers) (pp. 4171-4186)

Domingos, P. (2015). *The Master Algorithm: How the Quest for the Ultimate Learning Machine Will Remake Our World*. New York: Basic Books.

Drucker, P.F. (1993) *Post-capitalist society.* Harper Business, pp. 6.

Friedman, J. , Hastie, T., & Tibshirani, R. (2009). *The elements of statistical learning: Data mining, inference, and prediction (2nd ed.)*. New York, NY: Springer.

Gao, J., Galley, M., & Li, L. (2018). “Neural Approaches to Conversational AI.” In Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics: Tutorial Abstracts (pp. 2-7), Melbourne, Australia. Association for Computational Linguistics.

Goldberg, Y., 2017. ‘Neural Network Methods for Natural Language Processing’. *Synthesis Lectures on Human Language Technologies,* 10(1), pp. 1-309.

Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning.* Cambridge, MA: MIT Press.

Hansen, M. T., Nohria, N. and Tierney, T. (1999). “What’s Your Strategy for Managing Knowledge”, *Harvard Business Review*, March-April, pp. 106-116.

Hinton, G. E., Rumelhart, D. E., & Williams, R. J. (1986). “Learning representations by back-propagating errors.” *Nature*, 323(6088) pp. 533–536

Hochreiter, S., & Schmidhuber, J. (1997). “Long short-term memory.” *Neural computation,* 9(8), pp. 1735-1780.

ITU (2021). United Nations Activities on Artificial Intelligence 2021 (AI). Available at:  [https://www.itu.int/hub/publication/s-gen-unact-2021/](https://www.itu.int/hub/publication/s-gen-unact-2021/) (Accessed: 15th March 2023)

ITU (2023). United Nations Activities on Artificial Intelligence (AI) 2022. Available at:  [https://www.itu.int/hub/publication/s-gen-unact-2022/](https://www.itu.int/hub/publication/s-gen-unact-2022/) (Accessed: 15th March 2023)

Jordan, M. I., & Mitchell, T. M. (2015). “Machine learning: Trends, perspectives, and prospects.” *Science*, 349(6245), pp. 255-260. 

Jurafsky, D., & Martin, J. H. (2019). *Speech and Language Processing (3rd ed.).* Pearson.

Kiros, R., Zhu, Y., Salakhutdinov, R. R., Zemel, R., Urtasun, R., Torralba, A., & Fidler, S. (2015). ‘Skip-thought vectors.’ *Advances in neural information processing systems*, 28, pp. 3294-3302.

Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). “ImageNet Classification with Deep Convolutional Neural Networks.” *Advances in Neural Information Processing Systems* 25 (NIPS 2012) (pp. 1097-1105). Curran Associates, Inc.

LeCun, Y., Bengio, Y., & Hinton, G. (2015). “Deep learning”. *Nature*, 521(7553), pp. 436-444.

Li, J., Liang, X., Shen, S., Xu, T., Feng, J., & Yan, S. (2016). “Scale-aware Fast R-CNN for Pedestrian Detection.”

Lighthill, J. (1973). *Artificial Intelligence: A General Survey.* In Artificial Intelligence: A Paper Symposium. Science Research Council.

McAdam, R., & Reid, R. (2000). ‘A comparison of knowledge management models and their application.’ *Journal of Knowledge Management*, 5(4), pp. 302-312.

McCarthy, J., Minsky, M. L., Rochester, N., & Shannon, C. E. (2006). “A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence, August 31, 1955.” *AI Magazine*, 27(4), 12.

McCorduck, P. (2004). *Machines Who Think: A Personal Inquiry into the History and Prospects of Artificial Intelligence.* Natick, MA: A K Peters.

Minsky, M. (1967). *Computation: Finite and infinite machines.* Englewood Cliffs, NJ: Prentice-Hall.

Mitchell, T. M. (1997). *Machine learning.* New York: McGraw-Hill.

Mnih, V., Kavukcuoglu, K., Silver, D., Rusu, A. A., Veness, J., Bellemare, M. G., … & Petersen, S. (2015). “Human-level control through deep reinforcement learning.” *Nature*, 518(7540), pp. 529-533.

Mozi. (2010). *Mozi: Basic Writings (Burton Watson, Trans.)*. New York: Columbia University Press.

Murphy, K. P. (2012). *Machine learning: a probabilistic perspective*. Cambridge, MA: MIT Press.

Nilsson, N. J. (1996). *Learning machines: Foundations of trainable pattern-classifying systems.* New York: 

Nilsson, N. J. (2009). *The Quest for Artificial Intelligence: A History of Ideas and Achievements.* Cambridge, UK: Cambridge University Press.

Nonaka, I., & Takeuchi, H. (1995). *The Knowledge-creating Company: How Japanese Companies Create the Dynamics of Innovation.* Oxford, UK: Oxford University Press.

OpenAI. (2022). Improving language understanding with unsupervised learning. Available at: [https://openai.com/research/language-unsupervised](https://openai.com/research/language-unsupervised) (Accessed: 15th March 2023)

Pennington, J., Socher, R., & Manning, C.D., 2014. ‘Glove: Global vectors for word representation’. *Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (EMNLP)*, pp. 1532-1543.

Radford, A., Jozefowicz, R., & Sutskever, I. (2017). “Learning to Generate Reviews and Discovering Sentiment.” arXiv preprint arXiv:1704.01444.

Rowley, J. (1999). “What is Knowledge Management?”. *Library Management*, Vol. 20, No. 8, pp. 416-420

Ruder, S., Vulic, I., & Søgaard, A. (2019). ‘A survey of cross-lingual word embedding models.’ *Journal of Artificial Intelligence Research*, 65, pp. 569-630.

Russell, S., & Norvig, P. (2010). *Artificial intelligence: A modern approach (3rd ed.)*. Upper Saddle River, NJ: Prentice Hall.

Russell, S., Dewey, D., & Tegmark, M. (2015). “Research priorities for robust and beneficial artificial intelligence.” *AI Magazine*, 36(4), pp. 105-114.

Salih, B. and Efnan, S.G., 2022. “The Impact of Features and Preprocessing on Automation Text Summarization.” *Romanian Journal of Information Science and Technology*, 25(2), pp.117-132.

Samuel, A. L. (1959). “Some studies in machine learning using the game of checkers.” *IBM Journal of Research and Development,* 3(3), 210-229.

Sarvary, M. (1999). “Knowledge Management and Competition in the Consulting Industry”, *California Management Review*, Vol. 41, No.2, pp. 95-107

Serrat, O. (2017). *Knowledge Management in Organizations: A Critical Introduction.* Routledge.

Shannon, C.E. (1950). “Programming a Computer for Playing Chess”. *Philosophical Magazine* 41(314)

Singhal, A. (2001). ‘Modern information retrieval: A brief overview.’ *IEEE Data Engineering Bulletin*, 24(4), pp. 35-43.

Strubell, E., Ganesh, A., & McCallum, A. (2019). ‘Energy and policy considerations for deep learning in NLP.’ *Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics*, pp. 3645-3650.

Sutton, R. S., & Barto, A. G. (2018). *Reinforcement learning: An introduction.* Cambridge, MA: MIT Press.

Turing, A. M. (1950). Computing machinery and intelligence. *Mind*, LIX(236), 433-460.

Vinuesa, R., Azizpour, H., Leite, I., Balaam, M., Dignum, V., Domisch, S., … & Madhav, P. (2020). “The role of artificial intelligence in achieving the Sustainable Development Goals.” *Nature Communications*, 11(1), 1-10.
Yang, G. Z. (2018). The grand challenges of Science Robotics. *Science Robotics*, 3(14), eaar7650.
