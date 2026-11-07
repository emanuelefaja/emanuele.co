---
title: "OpenAI Whisper."
date: 2022-12-12T03:50:04Z
categories: [productivity, short, technology]
---

Recently, I accessed the OpenAI API and experimented with its tools. It’s incredible how much progress has been made in the last few years. It’s amazing how quickly we’ve grown accustomed to things that seemed impossible only a few years ago.

It is exciting — and a little scary — to see what progress is going to be made in the next few years.

I also learned that OpenAI has something called Whisper.

Whisper OpenAI is an open-source library for natural language processing (NLP). It helps developers create applications that understand natural language with ease and speed. It offers a variety of tools and models for natural language understanding, such as text classification, sentiment analysis, and entity recognition. Moreover, it provides pre-trained models to accelerate application development.

I tested Whisper and discovered it provides a near-perfect transcription of audio files into text. This is amazing! Previously, I tried to use transcription software to speed up my note-taking process since speaking is faster than writing.

Speaking is often five times faster than writing. For instance, a person can speak 150 words per minute, while writing only 30. Thus, speaking can be five times faster than writing in some cases. Moreover, it is more efficient in conveying complex ideas or concepts as it enables more natural expression and is easier to comprehend.

I use a Macbook, and get started was rather straight-forward.

First thing, I installed [Homebrew](https://brew.sh/) which is *“The Missing Packet Manager for macOS”*

I found this super easy. I opened the terminal and copied the installation code.

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

To use Whisper, you must install FFmpeg, an audio-processing library. If FFmpeg is not already on your machine, use the following command to install it:

```
brew install ffmpeg
```

Once that was done, the next thing was to install Python3:

```
 brew install python
```

Then we need to download PIP, which is the Python package manager:

```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
```

And then we install it by the following command:

```
python3 get-pip.py
```

Now we have completed the preliminaries, and we can install whisper!

```
pip3 install git+https://github.com/openai/whisper.git
```

And that’s that!

It is super easy to run Whisper, you simply type:

```
whisper audiofilename.m4a
```

It will perform its magic. The transcription will be shown in the terminal and a TXT file, SRT (SubRip Subtitle file) and VTT (Video Text Tracks) file will also be produced.

There is also a great library that enables *real-time* transcription, aptly named [LiveWhisper](https://github.com/Nikorasu/LiveWhisper)

> LiveWhisper outputs psuedo-live sentence-by-sentence dictation to terminal. Using [OpenAI’s Whisper](https://github.com/openai/whisper) model, and sounddevice library to listen to microphone. Audio from mic is stored if it hits a volume & frequency threshold, then when silence is detected, it saves the audio to a temp file and sends it to Whisper.

I prefer to record audio notes on my iPhone. Later, I use Whisper to transcribe them. I don’t need real-time transcription for my notes.

AI is becoming increasingly important in the future. It can improve personal productivity by taking care of mundane tasks that knowledge workers have to do. This is similar to how household appliances like dishwashers and washing machines freed up an entire generation of women, allowing them to join the workforce.

Similarly, the development of AI technology is freeing up time for people to focus on more creative and meaningful tasks, such as developing new products, services, and strategies. This could lead to a new wave of innovation and productivity, allowing individuals and organizations to become more efficient and successful.
