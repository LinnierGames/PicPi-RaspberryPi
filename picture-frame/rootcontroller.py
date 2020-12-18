import tkinter as tk
from PIL import ImageTk, Image, ImageOps

from os import listdir
from os.path import isfile, join

import di

class Application(tk.Frame):
    def __init__(self, root, photos_dir):
        super().__init__(root)
        self.photos_dir = photos_dir
        self.slide_duration = 1000 # milliseconds
        self.pack()
        self.place(relwidth=1, relheight=1)
        self.slideshow = []
        self.slideshow_index = 0
        self.photo = None
        self.imageLabel = None
        self.previous_imageLabel = None
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
            if self.imageLabel is not None:
                self.previous_imageLabel = self.imageLabel
            
            # Create and layout new image label.
            image = Image.open(file)
            resizedImage = ImageOps.fit(image, (1920,1080), method=0,
                                        bleed=0, centering=(0.5,0.5))
            self.photo = ImageTk.PhotoImage(resizedImage)
            
            if self.imageLabel is None:
                self.imageLabel = tk.Label(self, image=self.photo)
                self.imageLabel.pack()
                self.imageLabel.place(relwidth=1, relheight=1)
            else:
                # Update the image without destorying the previous Label.
                # This removes the flicker between switching images.
                self.imageLabel.configure(image=self.photo)
            
            # Queue moving to next slide.
            self.after(self.slide_duration, self.move_to_next_slide)
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

    master = tk.Tk()
    app = Application(master, di.userPhotosDirectory)
    master.mainloop()
