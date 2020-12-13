import tkinter as tk
from PIL import ImageTk, Image

from os import listdir
from os.path import isfile, join

import di

class Application(tk.Frame):
    def __init__(self, photos_dir):
        master = tk.Tk()
        super().__init__(master)
        self.photos_dir = photos_dir
        self.slide_duration = 1000 # milliseconds
        self.master = master
        self.pack()
        self.slideshow = []
        self.slideshow_index = 0
        self.photo = None
        self.imageLabel = None
        self.restart_slideshow()
        self.update_mainstage()

    def restart_slideshow(self):
        filenames = [join(self.photos_dir, f) for f in listdir(self.photos_dir) if isfile(join(self.photos_dir, f))]
        self.slideshow = filenames
        self.slide_index = 0

        print("slideshow size: ", len(filenames))

    def update_mainstage(self):
        file = self.slideshow[self.slideshow_index]
        
        try:
            image = Image.open(file)
            self.photo = ImageTk.PhotoImage(image)
            if self.imageLabel is not None:
                self.imageLabel.pack_forget()
            self.imageLabel = tk.Label(self, image=self.photo)
            self.imageLabel.pack()
            self.master.after(self.slide_duration, self.move_to_next_slide)
        except:
            self.move_to_next_slide()

    def move_to_next_slide(self):
        self.slideshow_index += 1
        if self.slideshow_index >= len(self.slideshow):
            self.slideshow_index = 0
        
        self.update_mainstage()

# If script mode, run the client here.
if __name__ == "__main__":
    import di

    app = Application(di.userPhotosDirectory)
    app.mainloop()
