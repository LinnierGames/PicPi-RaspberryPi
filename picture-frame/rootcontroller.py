import tkinter as tk
from PIL import ImageTk, Image, ImageOps

from os import listdir
from os.path import isfile, join

import sys
import random

import di

class Application(tk.Frame):
    def __init__(self, root, photos_dir):
        super().__init__(root)
        self.root = root
        self.photos_dir = photos_dir
        self.slide_duration = 1000 # milliseconds
        self.portrait_mode = True
        self.preferences = di.preferences
        self.pack()
        self.place(relwidth=1, relheight=1)

        self.slideshow = []
        self.slideshow_index = 0
        self.photo = None
        self.messageLabel = None
        self.imageLabel = None
        self.previous_imageLabel = None
        self.current_session = 0

        self.next_button = None

        self.refresh_config(update_mainstage=False)
        self.restart_slideshow(update_mainstage=False)
        self.update_mainstage(new_session=True)
            
        self.update_control_buttons()

    def restart_slideshow(self, update_mainstage=True):
        filenames = [join(self.photos_dir, f) for f in listdir(self.photos_dir) if isfile(join(self.photos_dir, f))]
        self.slideshow = filenames
        self.slide_index = 0

        print("slideshow size: ", len(filenames))
        if update_mainstage:
            self.update_mainstage(new_session=True)

    def refresh_config(self, update_mainstage=True):
        self.preferences.refresh()
        self.slide_duration = self.preferences.slide_duration
        self.portrait_mode = self.preferences.portrait_mode
        if update_mainstage:
            self.update_mainstage(new_session=True)

    def update_mainstage(self, new_session = False, move_forward_on_error = True):
        if len(self.slideshow) == 0:
            self.messageLabel = tk.Label(self, text="Slideshow is empty")
            self.messageLabel.pack()
            self.messageLabel.place(relwidth=1, relheight=1)
            if self.imageLabel is not None:
                self.imageLabel.destroy()
            return

        file = self.slideshow[self.slideshow_index]
        
        try:
            if self.imageLabel is not None:
                self.previous_imageLabel = self.imageLabel
            
            # Create and layout new image label.
            image = Image.open(file)

            if self.portrait_mode:
                image = image.rotate(90, resample=0, expand=0)
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
            
            if self.messageLabel is not None:
                self.messageLabel.destroy()
            
            # Queue moving to next slide.
            if new_session:
                self.current_session = random.randrange(10000)
            session = self.current_session
            def move_to_next_slide_if_session_is_same(self): 
                if session != self.current_session: return
                self.move_to_next_slide()
            self.after(self.slide_duration, lambda: move_to_next_slide_if_session_is_same(self))
        except:
            print("Unexpected error while loading", file, ":", sys.exc_info()[0])
            if move_forward_on_error:
                self.move_to_next_slide(new_session)
            else:
                self.move_to_previous_slide(new_session)

    def update_control_buttons(self):
        width_of_buttons = 96
        self.previous_button = tk.Button(self, text="<", command=lambda: self.move_to_previous_slide(new_session=True))
        self.previous_button.place(relheight=1, width=width_of_buttons, y=0, x=0)
    
        self.root.update()
        root_width = self.root.winfo_screenwidth()
        self.next_button = tk.Button(self, text=">", command=lambda: self.move_to_next_slide(new_session=True))
        self.next_button.place(relheight=1, width=width_of_buttons, x=root_width - width_of_buttons)

    def move_to_next_slide(self, new_session=False):
        self.slideshow_index += 1
        if self.slideshow_index >= len(self.slideshow):
            self.slideshow_index = 0
        
        self.update_mainstage(new_session)

    def move_to_previous_slide(self, new_session=False):
        self.slideshow_index -= 1
        if self.slideshow_index < 0:
            self.slideshow_index = len(self.slideshow) - 1
        
        self.update_mainstage(new_session, move_forward_on_error=False)

# If script mode, run the client here.
if __name__ == "__main__":
    import di

    master = tk.Tk()
    # master.attributes("-alpha", 0.5) 
    app = Application(master, di.userPhotosDirectory)
    master.mainloop()
