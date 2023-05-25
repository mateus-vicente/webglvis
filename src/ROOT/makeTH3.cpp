#include <math.h>
#include <sstream>
#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <TFile.h>
#include <TH3D.h>
#include "TTree.h"
#include "TROOT.h"
#include <chrono>

using namespace std;

bool isInside(int x, int y, int z, int BX, int BY, int BZ) {
    if (abs(x) > BX) {
        return false;
    }
    if (abs(y) > BY) {
        return false;
    }
    if (abs(z) > BZ) {
        return false;
    } else {
        return true;
    }
}

void Bresenham3D(TH3D *Out_histogram, int x1, int y1, int z1, int x2, int y2, int z2)
{
    int i, dx, dy, dz, l, m, n, x_inc, y_inc, z_inc, err_1, err_2, dx2, dy2, dz2;
    int point[3];
    //cout << "x1 :\t" << x1 << "\t" << y1 << "\t" << z1 << endl;
    //cout << "x2 :\t" << x2 << "\t" << y2 << "\t" << z2 << endl;
    point[0] = x1;
    point[1] = y1;
    point[2] = z1;
    dx = x2 - x1;
    dy = y2 - y1;
    dz = z2 - z1;
    x_inc = (dx < 0) ? -1 : 1;
    l = abs(dx);
    y_inc = (dy < 0) ? -1 : 1;
    m = abs(dy);
    z_inc = (dz < 0) ? -1 : 1;
    n = abs(dz);
    dx2 = l << 1;
    dy2 = m << 1;
    dz2 = n << 1;

    if ((l >= m) && (l >= n))
    {
        err_1 = dy2 - l;
        err_2 = dz2 - l;
        for (i = 0; i < l; i++)
        {
			if (isInside(point[0], point[1], point[2], 680, 170, 170)) {
            	Out_histogram->Fill(point[0], point[1], point[2]);
			}
            if (err_1 > 0)
            {
                point[1] += y_inc;
                err_1 -= dx2;
            }
            if (err_2 > 0)
            {
                point[2] += z_inc;
                err_2 -= dx2;
            }
            err_1 += dy2;
            err_2 += dz2;
            point[0] += x_inc;
        }
    }
    else if ((m >= l) && (m >= n))
    {
        err_1 = dx2 - m;
        err_2 = dz2 - m;
        for (i = 0; i < m; i++)
        {
			if (isInside(point[0], point[1], point[2], 680, 170, 170)) {
            	Out_histogram->Fill(point[0], point[1], point[2]);
			}
            if (err_1 > 0)
            {
                point[0] += x_inc;
                err_1 -= dy2;
            }
            if (err_2 > 0)
            {
                point[2] += z_inc;
                err_2 -= dy2;
            }
            err_1 += dx2;
            err_2 += dz2;
            point[1] += y_inc;
        }
    }
    else
    {
        err_1 = dy2 - n;
        err_2 = dx2 - n;
        for (i = 0; i < n; i++)
        {
			if (isInside(point[0], point[1], point[2], 680, 170, 170)) {
            	Out_histogram->Fill(point[0], point[1], point[2]);
			}
            if (err_1 > 0)
            {
                point[1] += y_inc;
                err_1 -= dz2;
            }
            if (err_2 > 0)
            {
                point[0] += x_inc;
                err_2 -= dz2;
            }
            err_1 += dy2;
            err_2 += dx2;
            point[2] += z_inc;
        }
    }
	if (isInside(point[0], point[1], point[2], 680, 170, 170)) {
    	Out_histogram->Fill(point[0], point[1], point[2]);
	}
}

int makeTH3(string file_name = "source2b.txt", int events = -1)
{
 	auto start = std::chrono::system_clock::now();
    TH3D *Histogram_visualization = new TH3D("Visual", "Visual", 680, -340, 340, 340, -170, 170, 340, -170, 170);
    cout << "File name:	" << file_name << endl;
	if(events != -1) cout << "Running " << events << " events" << endl;

    string file_line, dummy;
    fstream input_file;;
    input_file.open(file_name);
    double x1, y1, z1;
    double x2, y2, z2;
    int X1, Y1, Z1;
    int X2, Y2, Z2;
    int line_number = 0;
    // input_file.open();

    while (getline(input_file, file_line))
    {

        if (line_number % 100 == 0)
        {
			if(events != -1 && line_number > events) break;
            cout << "Event\t" << line_number << endl;
        }

        if (file_line.find("#") != string::npos)
        {

            getline(input_file, file_line);

            stringstream mystream(file_line);
            mystream >> dummy >> x1 >> y1 >> z1 >> dummy;

            getline(input_file, file_line);

            stringstream mystream2(file_line);
            mystream2 >> dummy >> x2 >> y2 >> z2 >> dummy;
			
            X1 = x1 * 10;
            Y1 = y1 * 10;
            Z1 = z1 * 10;
            X2 = x2 * 10;
            Y2 = y2 * 10;
            Z2 = z2 * 10;

            Bresenham3D(Histogram_visualization, X1, Y1, Z1, X2, Y2, Z2);
        }
        else
        {
            cout << "Weird event !" << endl;
            cout << file_line << endl;
        }
        line_number++;
    }
    string output_file_name = file_name + "_OUT.root";
    TFile *f = new TFile(output_file_name.c_str(), "RECREATE");
    Histogram_visualization->Write();
    f->Close();
    input_file.close();
	auto end = std::chrono::system_clock::now();
	std::chrono::duration<double> elapsed_seconds = end - start;
	std::cout << "elapsed time: " << elapsed_seconds.count() << "s" << std::endl;
    return 0;
}
