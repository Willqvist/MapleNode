import skimage
import moviepy
from moviepy.editor import VideoFileClip
from skimage.filters import gaussian
import sys

blurRadius = int(sys.argv[2])
def blur(image):
    """ Returns a blurred (radius=2 pixels) version of the image """
    return gaussian(image.astype(float), sigma=blurRadius)


video = sys.argv[1]
clip = VideoFileClip(video)
clip_blurred = clip.fl_image( blur )
clip_blurred.write_videofile("blurred_video.mp4")
print ("hello command line is %s" % video)