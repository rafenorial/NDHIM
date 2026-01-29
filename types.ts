
export interface Student {
  id: string;
  roll: number;
  reg: string;
  nameBN: string;
  nameEN: string;
  class: string;
  branch: string;
  dob: string;
  bloodGroup: string;
  fName: string;
  fOcc: string;
  fPhone: string;
  mName: string;
  mOcc: string;
  addr: string;
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  photo: string;
  status: 'Pending' | 'Verified';
  session: string;
  trx?: string;
  payMethod?: string;
  date: string;
}

export interface AppConfig {
  logo: string;
  notice: string;
  headName: string;
  headNum: string;
  headImg: string;
  presName: string;
  presNum: string;
  presImg: string;
}

export type SubjectMarks = Record<string, string>; // Subject Name -> Marks string
export type AllMarks = Record<string, SubjectMarks>; // StudentRoll_Session -> Marks

export enum Section {
  Home = 'home',
  Admission = 'admission',
  ManualEntry = 'manual-entry',
  IDCard = 'id-card',
  Tracking = 'tracking',
  AdmitCard = 'admit-card',
  Result = 'result',
  Admin = 'admin'
}
