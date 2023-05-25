#include <math.h>
#include "TCanvas.h"
#include "TH2D.h"
#include <sstream>
#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <TFile.h>
#include <TH3D.h>
#include "TTree.h"
#include "TROOT.h"

void makeTextArray(TString file_name = "new_root_file.root", bool rotate = false){
//void makeTextArray(TString file_name = "out_source2b.root", bool rotate = false){
	TFile::Open(file_name);
	TFile *file = new TFile(file_name,"READONLY");

	TH3D *imported_3dhist = (TH3D *)file->Get("Visual");
	if(rotate){
		cout << "Rotating histogram" << endl;
		TH3D* rotated = new TH3D("hist_swapped", imported_3dhist->GetTitle(),
				imported_3dhist->GetNbinsX(), imported_3dhist->GetXaxis()->GetXmin(), imported_3dhist->GetXaxis()->GetXmax(),
				imported_3dhist->GetNbinsZ(), imported_3dhist->GetZaxis()->GetXmin(), imported_3dhist->GetZaxis()->GetXmax(),
				imported_3dhist->GetNbinsY(), imported_3dhist->GetYaxis()->GetXmin(), imported_3dhist->GetYaxis()->GetXmax());

		for (int ix = 1; ix <= imported_3dhist->GetNbinsX(); ix++) {
			for (int iy = 1; iy <= imported_3dhist->GetNbinsY(); iy++) {
				for (int iz = 1; iz <= imported_3dhist->GetNbinsZ(); iz++) {
					double content = imported_3dhist->GetBinContent(ix, iy, iz);
					rotated->SetBinContent(ix, imported_3dhist->GetNbinsY() - iz, iy, content);
				}
			}
		}
		imported_3dhist = rotated;
	}

	int width = 300;
	ofstream out_txt_file(Form("%s_TextArray_%ix%ix%i.txt", file_name.Data(), width, width, width));
	cout << "Starting text" << endl;

	int full_range_x = 680;
	int full_range_y = 340;
	int full_range_z = 340;
	for(int x = full_range_x/2 - width/2 + 1; x < full_range_x/2 - width/2 + 1 + width; x++){					//	1 -> 681
		out_txt_file << "X = " << x << endl;
		cout << "X = " << x << endl;
		for(int y = full_range_y/2 - width/2 + 1; y < full_range_y/2 - width/2 + 1 + width; y++){				//	1 -> 341
			//out_txt_file << "Y = " << y << endl;
			for(int z = full_range_z/2 - width/2 + 1; z < full_range_z/2 - width/2 + 1 + width; z++){			// 	1 -> 341
				//out_txt_file << "Z = " << z << " ";
				out_txt_file << imported_3dhist->GetBinContent(x,y,z) << "	";
			}
			out_txt_file << endl;
		}
	}
	out_txt_file.close();
}
