const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withAdMobFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn("❌ Podfile not found.");
        return config;
      }

      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (!contents.includes("pod 'ExpoModulesCore'")) {
        contents = contents.replace(
          /use_expo_modules!/,
          `use_expo_modules!\n  pod 'ExpoModulesCore', :path => '../node_modules/expo-modules-core'`
        );

        fs.writeFileSync(podfilePath, contents);
        console.log("✅ Patched Podfile with ExpoModulesCore");
      } else {
        console.log("ℹ️ ExpoModulesCore already present in Podfile.");
      }

      return config;
    },
  ]);
}

module.exports = withAdMobFix;
