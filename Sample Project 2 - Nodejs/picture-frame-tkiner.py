import tkinter as tk
from PIL import ImageTk, Image

class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.pack()
        self.create_widgets2()

    def create_widgets(self):
        self.hi_there = tk.Button(self)
        self.hi_there["text"] = "Hello World\n(click me)"
        self.hi_there["command"] = self.say_hi
        self.hi_there.pack(side="top")

        self.quit = tk.Button(self, text="QUIT", fg="red",
                              command=self.master.destroy)
        self.quit.pack(side="bottom")
        
    def create_widgets2(self):
        refresh = tk.Button(self)
        refresh["text"] = "Refresh!"
        refresh["command"] = self.refresh
        refresh.pack()
        
        title = tk.Label(self, text="Images!")
        title.pack()
        
#         frame = tk.Frame(self, bg='red')
#         frame.place(relwidth=1, relheight=1)
        
        photo = ImageTk.PhotoImage(Image.open("photos/image4.png"))
        imageLabel = tk.Label(self, image=photo)
#         photo = tk.PhotoImage(file="photos/image2.png")
#         imageLabel = tk.Label(self, image=photo)
        imageLabel.pack()

    def refresh(self):
        print("Refresh!")

    def say_hi(self):
        print("hi there, everyone!")

root = tk.Tk()
app = Application(master=root)
app.mainloop()