# VFPHL // Vegan-Friendly PHL App

[Live Site](https://livetodeliver.github.io/VFPHL/)

## Screenshots:

### Landing Page / Search Navigation
![VPFPHL Screenshot of Landing Page/Search Nav](https://github.com/livetodeliver/VFPHL/blob/master/ScreenShot1.png)

### All Open Search Fields
![VPFPHL Screenshot of Landing Page/Search Nav](https://github.com/livetodeliver/VFPHL/blob/master/ScreenShot2.png)

### One Open Search Field (Filters)
![VPFPHL Screenshot of Landing Page/Search Nav](https://github.com/livetodeliver/VFPHL/blob/master/ScreenShot3.png)

### Results w/ Map
![VPFPHL Screenshot of Landing Page/Search Nav](https://github.com/livetodeliver/VFPHL/blob/master/ScreenShot4.png)


### Results w/ Map an entry selected creating location marker
![VPFPHL Screenshot of Landing Page/Search Nav](https://github.com/livetodeliver/VFPHL/blob/master/ScreenShot5.png)

## Summary:

This app utilizes the VegGuide.ORG Rest API, Google Maps API, and Google Places API to find vegan and vegan-friendly restaurant locations within the Philadelphia area.  Users have the ability to select certain search paramaters to filter results, and then are given a map that can display the location for a selected result entry. 
Users may choose to search by distance based on a given address, by selected neighbhorhood from a dropdown menu, or simply just do a blanket search for any vegan-friendly restaurants in Philadelphia that meet their other selected criteria. 

### Notes about creating this app:
The VegGuide API was extremely difficult to work with, in part to the fact that it has not been updated since 2013. Because of this I had to narrow the scope of the project a bit from what was initially planned. Additionally, a lot of the data within the API is outdated, so some restaurants that are returned in the results no longer exist or have incorrect corresponding information (such as address, website, etc), and I was umable to figure out how to filter out the outdated results or update them in any way. If a Google Places ID is not found to match a VegGuide Result then an alert will show up on the users screen, but in some cases a marker will still be shown to any restaurant matching the name even if it's in another city.  

In a future version of this app I would likely scrap using the VegGuide API all together, and instead solely use Google Places and possibly import the KML data from an already created Google map that is extremely extensive that was made by a local Philly Vegan group. 

I am aware of some formatting inconsistencies with the way some of the classes/IDs were written, and also some use of vanillaJS mixed in with jQuery.  I realized much of this towards the end and decided to leave it, so as to not risk accidentally breaking the app right before submitting, however, I do plan to eventually go back to fix those inconsistencies.

### Technology Used: 
HTML/CSS/Javascript/jQuery
