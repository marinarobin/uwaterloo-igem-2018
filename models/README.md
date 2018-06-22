# Models
This directory contains models for the 2018 iGEM team

## Biomodels Brainstorming
**1.** Degradation Tags

   * Model pretending we are using them

**2.** Plasmid Loss

   * How Fast?
   * How does this change how we control it?
   * Dependent on time (?) e.g. # of divisions

**3.** Growth Rates of different populations

   * Healthy -- slower than w/ light faster than w/o light

**4.** Control Methods:

   * Given some instantaneous growth rate, how do we vary the PWM
   * How does the light impulses affect the growth rates

**5.** Desensitization to light?

**6.** CCaR activation

**7.** Methionine production

**8.** Protein synthesis wrt methionine levels

**9.** We don’t know how CCaS/R is permitting range of values

**10.** Life cycle stage

**11.** Is light changing doubling time or is light changing which cells can divide? 

   * Both but which is the dominant process

**12.** Parameters that may help us build our equations

   * Interaction rate with light 
   * Limitation of light intensity
      - Creating a range of light effects 
      - Std deviation of this
   * Interactions between populations
   * The proportion of culture that will interact with light

**13.** Time dependant simulation modelling for growth based on MetE w/ CRV 

**14.** Methionine use/degradation and how that affects growth rate

**15.** Model it with simplifications and work up

**16.** Can we determine how wrong we are in terms of reading the populations

**17.** Use UV to find density Beer’s Law 

**18.** Find out how turbidostat works

   * When the turbidostat measures OD, it stops stirring. Does this affect the population from being evenly distributed

**19.** Modelling the turbidostat and co-culture in turbidostat

**20.** Time Delay between starts and stops

**21.** Stochasticity and randomness to our system

**22.** How long does the experiment take

**23.** Momentum, increasing growth rate is like how much force is being applied and then it slows down

   * If it works like momentum, we can use stabilization algorithm
   * Use physics knowledge

**24.** Are the cells independent?

## Signals Brainstorming

### Input
**1.** Are we using a normal camera or a fluorescent microscope?

**2.** How do we interpret the raw image data?

**3.** Preprocessing on the image data?

**4.** Reliability and linearity of fluorescence data?

**5.** Filtering ambient light? (excitation LEDs)

**6.** Is normalizing the fluorescence readings just a constant shift?

**7.** Do we care about absolute growth rate?

**8.** Do all cells fluoresce equally?

### Output
**1.** Do we use MPC or PID?

**2.** Shape of signal

   * Square wave?
   * Fixed frequency?

**3.** Period of modulation?

**4.** Just red or just green or both? Is one faster? Other considerations?

**5.** How does the delay in our system affect our approach?

**6.** Do we need some sort of calibration sequence?
