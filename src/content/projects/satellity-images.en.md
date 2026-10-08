---
code: PRJ_002
title: Satellite corn classification
type: Academic · Computer vision
year: '2020'
role: Capstone project — Fatec
stack: Python · CNN · QGIS
order: 2
layout: article
summary: Detecting corn fields in CBERS-3 satellite imagery with deep learning, to classify which farms have corn planted.
cover: ../../assets/projects/satellity-images/banner.jpeg
coverAlt: Corn field
thumb: ../../assets/projects/satellity-images/banner.jpeg
---

## Goal

An academic project to collect satellite images of farms with active corn crops and use artificial intelligence to recognise that crop in other images — classifying which farms have corn planted.

## Materials and methods

The algorithms were written in **Python**, using deep learning libraries for convolutional neural networks (**CNN**).

**QGIS** (a geographic information system for viewing, editing and analysing georeferenced data) was used to extract spectral bands and inspect the maps downloaded from **INPE** (Brazil's National Institute for Space Research).

Images came from the **CBERS-3** satellite's **MUX** sensor (Regular Multispectral Camera): 20-metre resolution, 4 spectral bands plus a panchromatic one (on the CCD). Its 120 km swath suits municipal and regional studies, and its 26-day revisit supports analysing phenomena of compatible duration — improvable thanks to the CCD's side-looking capability. The bands cover the visible and near-infrared range, giving good contrast between vegetation and other objects.

Images were processed at level **L4**: orthorectified, with radiometric correction and geometric correction refined by ground control points and a digital elevation model.

## Execution

Once the corn fields were located, we collected their images in 4 spectral ranges: blue, green, red and near-infrared.

![Corn field in RGB](../../assets/projects/satellity-images/milho2.png "RGB")
![Red band](../../assets/projects/satellity-images/milho2_red.png "Red")
![Green band](../../assets/projects/satellity-images/milho2_green.png "Green")
![Blue band](../../assets/projects/satellity-images/milho2_blue.png "Blue")
![Near-infrared band](../../assets/projects/satellity-images/milho2_nir.png "Near-infrared")

The images were then split into tiles to train the deep learning network. Since data collection and cleaning drive the result, we spent a large share of the time on those algorithms, aiming for a satisfactory accuracy rate.

## Next steps

A possible evolution is to combine the images with each region's **NDVI**, using tools and databases such as **SATVeg** to get the NDVI history of every point on the map:

![NDVI map of the corn field region](../../assets/projects/satellity-images/maize_map_NDVI.png "NDVI map")
![NDVI history chart](../../assets/projects/satellity-images/maize_graph_ndvi.png "NDVI history (SATVeg)")

That would enable a new NDVI-based classification feature.
