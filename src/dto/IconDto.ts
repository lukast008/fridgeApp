import { ImageSourcePropType } from "react-native";

export default interface IconDto {
  name: string,
  iconPath: ImageSourcePropType,
  tags?: string[],
}