# Model

## Overview

The goal of our model is to provide our software with the ability to predict and control the growth of our e. coli cultures.
After careful research, we decided to implement a model predictive control (MPC) system alongside moving horizon estimation (MHE) to
optimize the functionality of our system.

## Biological Model

## Mathematics

### The Model



### Model Predictive Control

### Moving Horizon Estimation

## Implementation
Following the derivation of our physical model, we used a python library called GEKKO in order to merge it with MPC and MHE.
Using GEKKO's built in differential equation solver as well as some white noise, we ran some simulations in order to test the GEKKO
suite's features.

---Figure: Simulated population dynamics---

[discussion of simulation]

Using these simulations we tuned our software and tested it in the lab.

---Figure: Real life results---

[discussion of results in terms of the model]

To reference:
https://apmonitor.com/wiki/index.php/Main/GekkoPythonOptimization
