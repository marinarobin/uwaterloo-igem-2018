# Max Reed
# August 22, 2018
# A program designed for the UW iGEM Robots Subsubteam within the Math Subteam. It is meant to
# help quantify the amount of green fluorescence visible in an image. We have a very bright blue
# LED and a band pass filter that blocks blue light but lets through green light (and also red
# light I think). If you put the filter in front of a camera while shining the blue LED on bacterial
# samples, you can get pictures of the "green fluorescence" of your samples. Visually, it is
# possible to distinguish between pictures of "high fluorescence" samples and "low fluorescence"
# samples, but it is good to have a program to make the analysis quantitative.

from scipy import misc

# this python program should be put in the same directory as whatever images you want to analyze.
# you then enter the names of your images here.
fileNames = ["11","12","13","14","21","22","23","24"]

for name in fileNames:
    currentImage = misc.imread(name + '.png') 	# the image gets read in as a 3D array.

    # the 3rd dimension (the second embedded array) has the values:
    # [red value, green value, blue value, 255]
    # i don't know why 255 is added on at the end.
    # this is a magical command that flattens the array so now it has the dimensions:
    # (height in pixels * width in pixels)x(4)
    rgb_flat_list = [item for sublist in currentImage for item in sublist]

    # the rest of this is just finding the average rgb value for each image and outputting that.
    # the average blue value is probably useless. the average green value might actually get too much
    # bleed over from blue light, meaning the average red value actually gives the best idea of how
    # much green fluorescence there is. this is just a guess though (supported by a single experiment
    # that i performed on August 21st, 2018).
    totIntensity = [0, 0, 0]
    for j in range(len(rgb_flat_list)):
        for k in range(3):
            totIntensity[k] = totIntensity[k] + rgb_flat_list[j][k]
        for k in range(3):
            totIntensity[k] = totIntensity[k] / (1.0 * len(rgb_flat_list))

        print "Average (r,g,b) for {} : ({}/255, {}/255, {}/255)".format(
            name,
            round(totIntensity[0], 1),
            round(totIntensity[1], 1),
            round(totIntensity[2], 1)
        )

# It's pretty dumb to include this here but this is the output from my first experiment on August 21st:
# Average (r,g,b) for 11: (77.1/255, 224.9/255, 191.9/255)
# Average (r,g,b) for 12: (121.5/255, 232.5/255, 198.1/255)
# Average (r,g,b) for 13: (59.4/255, 216.8/255, 183.9/255)
# Average (r,g,b) for 14: (118.1/255, 233.4/255, 200.9/255)
# Average (r,g,b) for 21: (136.8/255, 240.7/255, 220.0/255)
# Average (r,g,b) for 22: (114.3/255, 227.6/255, 200.5/255)
# Average (r,g,b) for 23: (61.0/255, 207.2/255, 178.7/255)
# Average (r,g,b) for 24: (66.6/255, 209.0/255, 179.7/255)

# 12, 14, 21, and 22 were the high fluorescence samples. The major flaw in this experiment was that I didn't normalize
# for optical density, though all samples should've had an OD of about 1.
