# Repository for Visualization Tool for Lines-of-Response (LOR)

This repository contains the source code for a visualization tool that uses WebGL and the Three.js library to display lines-of-response (LOR) measured with the 100µPET scanner.

## Getting Started

To use this tool, follow these steps:

1. Run ```npm install``` to install the necessary dependencies (only needed when running for the first time)
2. Start the tool with ```npm start```.

### Visualization modes
There are two visualization options available, each with different requirement files. 
The files are available in the ```src/models_and_data/``` folder.
In both modes, the voxels rendered are always 100 µm wide.

- Visualization Option 1: 3D Histogram
This option requires long text files containing the 3D histogram information for all LORs. These files have the suffix "_TextArray_**X**x**Y**x**Z**.txt", where X, Y, and Z are the dimensions of the histogram.
In this mode, there will be one geometry and one material for each voxel. In this way we can control the color and opacity of each voxel independently, making it possible to have a histogram-like visualization. The down side is that we are limited by the number of meshes that the computer in use can handle. We have found that ~200k objects (from a 60x60x60 histogram) should run fine, but this is sensitive to the histogram data and to the ```min_scale_factor, x0 and A``` code variables/parameters.
    - When running on this mode, check the file ```LOR_clusters_3D-sources_500kevents.txt_OUT.root_TextArray_60x60x60.txt```

- Visualization Option 2: 3D Coordinates
This option requires text files with the 3D coordinates of the two endpoints of each line of response. The js code will make the LOR and will 3D rasterize them using the Bresenham algorithm. Within this mode, one can also visualize the scanner detector.
Here, all voxels belongs to the same mesh (a threejs InstancedMesh), which contains a single material.
The highlighting visualization of the voxels where there are many LORs crossing is achieved with additive blending of the voxels of each LOR.
    - When running on this mode, check the file ```LOR_clusters_5-point_sources_1000events.txt```

To change between the two modes, you can toggle the line comment from the file src/index.html:

```html
<!--- <script src="scannerMonitor_blending.js"></script> -->
<script src="scannerMonitor_histogram.js"></script>
```
