// Fallback for using MaterialIcons and FontAwesome on Android and web.

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";
import { ComponentProps } from "react";

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];
type FontAwesome6IconName = ComponentProps<typeof FontAwesome6>['name'];

type IconConfig = 
  | { type: "material"; name: MaterialIconName }
  | { type: "fontawesome6"; name: FontAwesome6IconName };

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": { type: "material" as const, name: "home" },
  "paperplane.fill": { type: "material" as const, name: "send" },
  "chevron.left.forwardslash.chevron.right": {
    type: "material" as const,
    name: "code",
  },
  "chevron.right": { type: "material" as const, name: "chevron-right" },
  "carrot.fill": { type: "fontawesome6" as const, name: "carrot" },
  "pump.soap": { type: "fontawesome6" as const, name: "pump-soap" },
  "pills.fill": { type: "fontawesome6" as const, name: "pills" },
  "gearshape.fill": { type: "material" as const, name: "settings" },
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons/FontAwesome on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons or FontAwesome.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconConfig = MAPPING[name];

  if (iconConfig.type === "fontawesome6") {
    return (
      <FontAwesome6
        color={color}
        size={size}
        name={iconConfig.name}
        style={style}
      />
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconConfig.name as MaterialIconName}
      style={style}
    />
  );
}
