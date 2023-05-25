#include <iostream>
#include "TFile.h"
#include "TH3D.h"
#include "TF1.h"
#include "TApplication.h"
#include "TSystem.h"
#include "TStyle.h"
#include "TCanvas.h"
#include "TLatex.h"
#include "TLegend.h"
#include "TPaveLabel.h"

Double_t Transfer_function(const Double_t *x, const Double_t *params)
{
  double N = 50; // maximum value of x
  double x0 = 40; // offset value
  double A = 0.85; // amplitude of exponential growth

  if (*x <= x0) {
      return 0.0;
  } else if (*x >= N) {
      return 1.0;
  } else {
      return 1.0 - exp(-A * (*x - x0) / (N - x0));
  }
}


void PlotHist(TString string = "new_root_file.root")
//void PlotHist(TString string = "center_test.txt_OUT.root")
{
  gStyle->SetCanvasPreferGL(1);
  //Int_t palette[1];
  //palette[0] = 1;
  //gStyle->SetPalette(1, palette);
  // TColor::InvertPalette();
  TCanvas *c1 = new TCanvas("c1", "Figure 1");
  TFile::Open(string);
  TFile *file = new TFile(string);

  TH3D *original = (TH3D *)file->Get("Visual");
  TH3D* monhist = new TH3D("hist_swapped", original->GetTitle(),
                                  original->GetNbinsX(), original->GetXaxis()->GetXmin(), original->GetXaxis()->GetXmax(),
                                  original->GetNbinsZ(), original->GetZaxis()->GetXmin(), original->GetZaxis()->GetXmax(),
                                  original->GetNbinsY(), original->GetYaxis()->GetXmin(), original->GetYaxis()->GetXmax());

  for (int ix = 1; ix <= original->GetNbinsX(); ix++) {
      for (int iy = 1; iy <= original->GetNbinsY(); iy++) {
          for (int iz = 1; iz <= original->GetNbinsZ(); iz++) {
              double content = original->GetBinContent(ix, iy, iz);
              monhist->SetBinContent(ix, original->GetNbinsY() - iz, iy, content);
          }
      }
  }

  monhist->Draw("glcolz");

  TList *lf = monhist->GetListOfFunctions();
  if (lf)
  {
    TF1 *tf = new TF1("TransferFunction", Transfer_function);
    lf->Add(tf);
  }
  /*
  monhist->SetTitle("OT");
  TPaveLabel *title = new TPaveLabel(-1., 0.86, 1., 0.98,
                                     "0.1 mm Voxel pitch - Pixel Count 3D render");

  title->SetFillColor(0);
  title->Draw();
  monhist->GetXaxis()->SetTitle("X [#mu m]");
  monhist->GetYaxis()->SetTitle("Y [#mu m]");
  monhist->GetZaxis()->SetTitle("Z [#mu m]");
  monhist->GetXaxis()->SetRangeUser(-350., 350.);
  monhist->GetYaxis()->SetRangeUser(-350., 350.);
  monhist->GetZaxis()->SetRangeUser(-350., 350.);
  c1->Update();
  */

  c1->Modified();
  c1->Update();
}
int main()
{
  PlotHist();
  return 0;
}
