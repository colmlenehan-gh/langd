# langd (discontinued)

**Language Audio Network Gateway Daemon (langd)**

langd is an open-source accessibility-focused tool designed to support users with additional needs by providing speech-to-text (STT), text-to-speech (TTS), and translation tools for real-time, in-person communication.

It aims to reduce communication barriers by offering simple, local-first language processing tools that can run on devices such as the Raspberry Pi. 

---
 
## Features

- Speech-to-Text (STT) support  
- Text-to-Speech (TTS) support  
- Real-time text translation  
- Local-first architecture (Raspberry Pi compatible)  
- Lightweight and modular design  

---

## Purpose

langd is built to improve real-world communication for people who may face language or accessibility barriers.

The project focuses on:
- Supporting in-person communication
- Reducing reliance on cloud-only services
- Providing simple, modular language tools
- Prioritising accessibility and usability

---

## Current State

The original version of langd is written in Python and uses Docker-based LibreTranslate for translation.

At this stage, setup requires some manual configuration and technical knowledge.

Future versions aim to:
- Simplify installation and setup
- Improve accessibility for non-technical users
- Integrate STT and TTS more seamlessly
- Provide a more user-friendly interface

---

## Architecture (current)

- Python application layer
- LibreTranslate (Docker-based translation backend)
- Planned STT/TTS processing layer

---

## Installation (current version)

Note: Setup is currently in development and may change.

### 1. Clone the repository
```bash
git clone https://github.com/colmlenehan-gh/langd.git
cd langd
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Start LibreTranslate (Docker)
```bash
docker run -d -p 5000:5000 libretranslate/libretranslate
```

### 4. Run the application
```bash
python3 main.py
```

---

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

You are free to use, modify, and distribute this software under the terms of this license.

---

## Future Goals

- One-command setup
- Improved accessibility for non-technical users
- Offline speech processing support
- Integrated STT + TTS + translation pipeline
- Potential mobile or network clients

---

## Contributing

Contributions are welcome.

Focus areas include:
- Accessibility improvements
- Setup simplification
- Performance improvements
- Speech pipeline development
```
