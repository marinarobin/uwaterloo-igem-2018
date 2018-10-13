# Signals
## Overview
The signals team has two jobs - writing software to automatically analyze incoming data from the lab, and writing software to
generate signals in reaction to the incoming data.

## Input
Images are taken of bacterial samples in the lab - the challenge is to extract information about the populations from the colors seen
in the image. Since the LED we use to control the bacteria is blue, we will look at the 'redness' of the image rather than the 
amount of green, as blue light bleeds into the green spectrum a little bit.
In order to do this, we use scipy to read the rgb values off of the image and track the intensity of red. This provides us with a
good approximation of the fluorescence.

## Output

Model Predictive Control is an optimization technique where a mathematical model of the system (alonside data)
is used to generate a strategy to optimize a certain value. In order to keep the co-culture at a certain population ratio
we need to come up with a sequence of light signals that keep the bacteria growing at a certain pace.

We define a few parameters for this algorithm:

A Manipulated Variable is a variable we are trying to control - in this case it is the population ratio.
A Controlled Variable is the parameter we change in order to 
