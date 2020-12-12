import tkinter as tk
from PIL import ImageTk, Image

from os import listdir
from os.path import isfile, join

photos_dir = "/home/pi/Pictures"

class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.slideshow = []
        self.slideshow_index = 0
        self.photo = None
        self.imageLabel = None
        self.pack()
        self.restart_slideshow()
        self.update_mainstage()

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
        
    def restart_slideshow(self):
        filenames = [join(photos_dir, f) for f in listdir(photos_dir) if isfile(join(photos_dir, f))]
        self.slideshow = filenames
        self.slide_index = 0
        # self.update_mainstage()

    def update_mainstage(self):
        file = self.slideshow[self.slideshow_index]
        
        self.photo = ImageTk.PhotoImage(Image.open(file))
        if self.imageLabel is not None:
            self.imageLabel.pack_forget()
        self.imageLabel = tk.Label(self, image=self.photo)
        self.imageLabel.pack()
        self.master.after(1000, self.move_to_next_slide)
        
    def move_to_next_slide(self):
        self.slideshow_index += 1
        if self.slideshow_index >= len(self.slideshow):
            self.slideshow_index = 0
        
        self.update_mainstage()

root = tk.Tk()
app = Application(master=root)

# If script mode, run the client here.
if __name__ == "__main__":
    app.mainloop()