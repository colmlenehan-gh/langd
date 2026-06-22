import tkinter as tk
from tkinter import ttk, messagebox
import requests
import pyttsx3
import speech_recognition as sr

SERVER = "http://localhost:5000/translate"

# finally onto tts setup omg
engine = pyttsx3.init()

def translate():
    text = input_box.get("1.0", tk.END).strip()

    if not text:
        messagebox.showwarning("Error", "Enter some text.")
        return

    data = {
        "q": text,
        "source": source_lang.get(),
        "target": target_lang.get(),
        "format": "text"
    }

    try:
        r = requests.post(SERVER, json=data)
        result = r.json()["translatedText"]

        output_box.delete("1.0", tk.END)
        output_box.insert(tk.END, result)

    except Exception as e:
        messagebox.showerror("langd", str(e))


def speak_text():
    text = output_box.get("1.0", tk.END).strip()

    if not text:
        messagebox.showwarning("Error", "Nothing to speak.")
        return

    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        messagebox.showerror("langd", str(e))


def speech_to_text():
    recognizer = sr.Recognizer()

    try:
        with sr.Microphone() as source:
            messagebox.showinfo("langd", "Listening...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)

        text = recognizer.recognize_google(audio)

        input_box.delete("1.0", tk.END)
        input_box.insert(tk.END, text)

    except Exception as e:
        messagebox.showerror("langd", str(e))


root = tk.Tk()
root.title("langd")
root.geometry("700x550")

title = tk.Label(root, text="Language Audio Network Gateway Daemon", font=("Arial",16))
title.pack(pady=10)

frame = tk.Frame(root)
frame.pack()

tk.Label(frame, text="From").grid(row=0, column=0)

source_lang = ttk.Combobox(frame, width=10)
source_lang["values"] = ["en", "fr", "es", "de", "it"]
source_lang.set("en")
source_lang.grid(row=0, column=1, padx=10)

tk.Label(frame, text="To").grid(row=0, column=2)

target_lang = ttk.Combobox(frame, width=10)
target_lang["values"] = ["en", "fr", "es", "de", "it"]
target_lang.set("fr")
target_lang.grid(row=0, column=3, padx=10)

tk.Label(root, text="Input").pack()

input_box = tk.Text(root, height=8, width=70)
input_box.pack()

button_frame = tk.Frame(root)
button_frame.pack(pady=10)

tk.Button(button_frame, text="Translate", command=translate, height=2).grid(row=0, column=0, padx=5)
tk.Button(button_frame, text="Speak Output", command=speak_text, height=2).grid(row=0, column=1, padx=5)
tk.Button(button_frame, text="Speech Input", command=speech_to_text, height=2).grid(row=0, column=2, padx=5)

tk.Label(root, text="Output").pack()

output_box = tk.Text(root, height=8, width=70)
output_box.pack()

root.mainloop()
