# Design

It’s been a long journey from ideas, to research sessions, design, failure, redesign, and redesign. One question, lead to another. In this page, we explain our system development and experimental design processes, and the reasoning behind the decisions we made along the way. Question by question, answer by answer, we invite you to learn more about this process.

### Major Goals of the Project

-   Create a stable co-culture system 
-   Be able to maintain the co-culture at any desired ratio 

## System Development
#### Q: How do we control growth rates? 

Our project aims to maintain a stable co-culture by addressing the problem of competition between different microbial populations. We wanted to address this by regulating growth. We considered doing this in two ways:
-   To kill cells in a population when it starts to outcompete the other
-   To slow the growth of one population and allow the other to catch up

Through our research, we came up with one method for each option. 
The first method involved expressing HipA, a serine/threonine protein kinase toxin, in the Escherichia coli (E. coli) population with the faster growth rate. This would begin to kill some of the culture which in turn would allow the slower culture to catch up, thereby maintaining the co-culture.    

The other method considered was to control the methionine production within the cell by controlling the metE gene. This gene is necessary for methionine biosynthesis. In a medium that lacks methionine, this gene becomes essential for growth. By controlling this gene’s expression, we can cut off the fast-growing population’s  supply of methionine to allow the slower population to catch up.

We decided to control the expression of metE in order to create our co-culturing system because it provides more dynamic control and a faster response from the cells once a command is given. Let’s say you have a co-culture with two bacterial populations: A and B. Population A starts out-growing the other so you turn off its metE production long enough to allow population B to catch up. But what if population B starts overgrowing? What if you want to change the ratio to now increase population A? If you had killed cells, it would take longer to get the few population A cells remaining to start dividing than it would if the cells were there all along, but simply arrested. 

####    A: By controlling metE expression.

#### Q: How do we control metE expression? 

In order to control the expression of two cultures independently of one another, we needed two different light-activated systems. The papers we had read from the Kammash Lab used the CcaS/CcaS system which is activated by green light and shut off by redlight. [1] By putting a CcaS/CcaR-responsive promoter in front of metE, we can promote its expression with green light and slow cell growth  with red light. We also decided to use this system because other research groups  had verified that it worked to control the expression of MetE and also control cell growth. [1,2]

The second system that we wanted  to test was a blue light activated system so that we could control both populations independently and simultaneously. The two systems that we found that use blue light are the pDawn and Opto-T7 RNA polymerase systems. We prefered Opto-T7 because its response time, that is the time it takes after the light is shined to start seeing an effect, is faster and closer to that of CcaS/CcaR.   Therefore,  we thought Opto-T7 would be a  better fit with our existing red/green light system. Unfortunately, due to an inability to acquire the OptoT7 plasmids in time,  we decided to use the pDawn.

#### A: Via optogenetic systems. 
#### Q: How do we monitor different populations in a co-culture? 
After both the control method and system were decided the next question to be answered was how we were going to monitor the relative quantities of both populations in our co-culture. In order to know which lights to shine, and thus which population’s growth to encourage, we need to obtain data on the relative abundance of the two populations. Ideally, this data would be collected in real time so that we could modulate the light in response to any changes so that the co-culture ratio we’re trying to maintain is not disturbed. In order to do this, we decided to add a fluorescent protein to each population, RFP to one and GFP to the other, and then detect the amount of each culture using a flow cytometer. The flow cytometer allows almost real-time data collection and is far faster than plating cells and waiting for them to grow overnight. After some testing we decided to change the plan to one culture with GFP and one culture with no fluorescent protein. We decided this because the laser in our flow cytometer is good at exciting GFP but not RFP and it would be much easier to collect data without RFP.

#### A: Fluorescence and flow cytometry. 



### Project Re-work

The design as described above is how we planned to carry out our project in order to develop a system which is able to maintain a co-culture at specified ratios. Unfortunately due to issues that arose with some of the light activated systems and time constraints, we had to rework the project design in order to complete our work in time. 
We removed the blue light system entirely since we could not assemble it fast enough. Instead, we decided to focus on the CcaS/CcaR system only. Our revised co-culture involves engineering our faster-growing E. coli population (JT2) to be controlled by CcaS/CcaR, and leaving our slower-growing E. coli population (DH5𝛂) as is.  This allowed us to continue to pursue the core objective of our project: to create a stable co-culture, while removing some of the complexity so that we may finish on time. 

## Experimental Design

#### Q: Is methionine shared between cells/populations? 

A major consideration for our system was that we would have to grow the culture in a medium without methionine, and ensure that methionine produced within cells is not excreted into the media.  This is an important consideration for our system because we are controlling growth of two different microbial populations by controlling methionine production. Our system favours the growth of one population by allowing it to produce methionine, while inhibiting the other population’s ability to do so. However, this wouldn’t work if methionine was released by cells producing it and taken up by others. 

#### Q: What is the metabolic load of MetE (over)expression? 
See p. 78 + 98 of online lab book 

#### Q: Can we reliably measure 2 populations in co-culture?
P. 110-112

#### Q: Can we control growth with red and green light? 
P.106-108

#### References

[1] A. Milias-Argeitis, M. Rullan, S. K. Aoki, P. Buchmann, and M. Khammash, “Automated optogenetic feedback control for precise and robust regulation of gene expression and cell growth,” Nature Communications, vol. 7, p. 12546, 2016.

[2] E. A. Davidson, A. S. Basu, and T. S. Bayer, “Programming Microbes Using Pulse Width Modulation of Optical Signals,” Journal of Molecular Biology, vol. 425, no. 22, pp. 4161–4166, 2013
