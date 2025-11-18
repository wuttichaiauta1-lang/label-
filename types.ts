export interface LabelInfo {
  name: string;
  image?: File;
  imageUrl?: string;
}

export interface LabelPart {
  cabinet: LabelInfo;
  device: LabelInfo;
  port: LabelInfo;
  subPort: LabelInfo;
}

export interface LabelData {
  project: string;
  from: LabelPart;
  to: LabelPart;
}
