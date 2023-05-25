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

void makeGif(TString file_name = "out_source2b.root", bool rotate = false){
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

	TCanvas *canvas_1 = new TCanvas("c1","Figure_1", 0,53,852,807);
	canvas_1->Range(-24687.41,-21277.42,21643.4,21222.58);
	canvas_1->SetLeftMargin(0.1659243);

	TH2D* YZ_projection = new TH2D("0.1 mm voxel grid slice","0.1 mm voxel grid slice;Z axis [#mum];Y axis [#mum]",340,-17000,17000,340,-17000,17000);
	YZ_projection->SetMinimum(0);
	YZ_projection->SetMaximum(12);
	YZ_projection->SetStats(0);

	cout << "Starting gif" << endl;
	for(int x = 1; x < 681; x++){
		cout << "X = " << x << endl;
		for(int y = 1; y < 341; y++){
			for(int z = 1; z < 341; z++){
				YZ_projection->SetBinContent(y,z,imported_3dhist->GetBinContent(x,y,z));
			}
		}

		YZ_projection->SetTitle(Form("0.1 mm voxel grid YZ slice (X = %i)",x));
		YZ_projection->Draw("colz");
		canvas_1->SaveAs(Form("%s.gif+",file_name.Data()));
	}
}
