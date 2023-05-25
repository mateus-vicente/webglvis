import numpy as np
from ROOT import TH3I, TH1I, TFile
import datetime
import concurrent.futures

def isInside(x, y, z, BX, BY, BZ):
    if abs(x) > BX:
        return False
    if abs(y) > BY:
        return False
    if abs(z) > BZ:
        return False
    return True

def Bresenham3D(Out_histogram, x1, y1, z1, x2, y2, z2):
    dx = x2 - x1
    dy = y2 - y1
    dz = z2 - z1
    x_inc = -1 if dx < 0 else 1
    l = abs(dx)
    y_inc = -1 if dy < 0 else 1
    m = abs(dy)
    z_inc = -1 if dz < 0 else 1
    n = abs(dz)
    dx2 = int(l) << 1
    dy2 = int(m) << 1
    dz2 = int(n) << 1

    point = [x1, y1, z1]

    if l >= m and l >= n:
        err_1 = dy2 - l
        err_2 = dz2 - l
        for _ in range(int(l)):
            if isInside(point[0], point[1], point[2], 680, 170, 170):
                Out_histogram.Fill(point[0], point[1], point[2])
            if err_1 > 0:
                point[1] += y_inc
                err_1 -= dx2
            if err_2 > 0:
                point[2] += z_inc
                err_2 -= dx2
            err_1 += dy2
            err_2 += dz2
            point[0] += x_inc
    elif m >= l and m >= n:
        err_1 = dx2 - m
        err_2 = dz2 - m
        for _ in range(int(m)):
            if isInside(point[0], point[1], point[2], 680, 170, 170):
                Out_histogram.Fill(point[0], point[1], point[2])
            if err_1 > 0:
                point[0] += x_inc
                err_1 -= dy2
            if err_2 > 0:
                point[2] += z_inc
                err_2 -= dy2
            err_1 += dx2
            err_2 += dz2
            point[1] += y_inc
    else:
        err_1 = dy2 - n
        err_2 = dx2 - n
        for _ in range(int(n)):
            if isInside(point[0], point[1], point[2], 680, 170, 170):
                Out_histogram.Fill(point[0], point[1], point[2])
            if err_1 > 0:
                point[1] += y_inc
                err_1 -= dz2
            if err_2 > 0:
                point[0] += x_inc
                err_2 -= dz2
            err_1 += dy2
            err_2 += dx2
            point[2] += z_inc
    if isInside(point[0], point[1], point[2], 680, 170, 170):
        Out_histogram.Fill(point[0], point[1], point[2])

'''
start = datetime.datetime.now()

root_file = TFile("new_root_file.root","RECREATE");

path = "/Users/mvicente/webglvis/src/ROOT/simulation_data/202109010"
file_path ="_Full_20_250Si_0200Kapton_000Bi_2x2_100um_1Chip_3mmCool.conf_all.npy"
n_files = 5

dets = np.load(path+str(1)+file_path)
dets = np.array([dets[:,::2,:].squeeze(), dets[:,1::2,:].squeeze()])

for i in range(2, n_files+1):
    print(path+str(i)+file_path)
    dets1 = np.load(path+str(i)+file_path)
    dets1 = np.array([dets1[:,::2,:].squeeze(), dets1[:,1::2,:].squeeze()])
    dets = np.hstack((dets, dets1))

Histogram_visualization = TH3I("Visual", "Visual", 680, -340, 340, 340, -170, 170, 340, -170, 170)
multiplier = 10
#for i in range(0, 100000):
print(dets.shape[1])
for i in range(0, dets.shape[1]):
    if(i % 1000 == 0):
        print(i)
    Bresenham3D(Histogram_visualization, dets[0][i][0] * multiplier, dets[0][i][1] * multiplier, dets[0][i][2] * multiplier, dets[1][i][0] * multiplier, dets[1][i][1] * multiplier, dets[1][i][2] * multiplier)

Histogram_visualization.Write()

end = datetime.datetime.now()
elapsed_seconds = end - start

print("elapsed time:", elapsed_seconds.total_seconds(), "s")
'''

start = datetime.datetime.now()

root_file = TFile("new_root_file.root", "RECREATE")

path = "/Users/mvicente/webglvis/src/ROOT/simulation_data/202109010"
file_path = "_Full_20_250Si_0200Kapton_000Bi_2x2_100um_1Chip_3mmCool.conf_all.npy"
n_files = 5

print(path + str(1) + file_path)
dets = np.load(path + str(1) + file_path)
dets = np.array([dets[:, ::2, :].squeeze(), dets[:, 1::2, :].squeeze()])

for i in range(2, n_files + 1):
    print(path + str(i) + file_path)
    dets1 = np.load(path+str(i)+file_path)
    dets1 = np.array([dets1[:,::2,:].squeeze(), dets1[:,1::2,:].squeeze()])
    dets = np.hstack((dets, dets1))

print(dets.shape[1])
Histogram_visualization = TH3I("Visual", "Visual", 680, -340, 340, 340, -170, 170, 340, -170, 170)
multiplier = 10

def process_data(i):
    Bresenham3D(Histogram_visualization, dets[0][i][0] * multiplier, dets[0][i][1] * multiplier, dets[0][i][2] * multiplier, dets[1][i][0] * multiplier, dets[1][i][1] * multiplier, dets[1][i][2] * multiplier)
#    progress = (i + 1) / dets.shape[1] * 100
#    print("Progress:", "{:.2f}%".format(progress))

# Create a ThreadPoolExecutor with a specified number of worker threads
num_threads = 4  # Adjust the number of threads as per your requirements
with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
    # Submit the tasks to the executor
    # Each task corresponds to processing data for a specific index i
    futures = [executor.submit(process_data, i) for i in range(0, dets.shape[1])]

    # Wait for the results
    concurrent.futures.wait(futures)

Histogram_visualization.Write()

end = datetime.datetime.now()
elapsed_seconds = end - start

print("elapsed time:", elapsed_seconds.total_seconds(), "s")
