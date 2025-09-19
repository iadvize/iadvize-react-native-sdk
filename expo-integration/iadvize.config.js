const { withAppBuildGradle, withProjectBuildGradle, withMainApplication } = require("@expo/config-plugins");

function addIAdvizeRepository(inputString, language) {
  // Insert the import statement right before the line containing " maven { url 'https://www.jitpack.io' }"
  const lineIndex = findLineIndex(inputString, "maven { url 'https://www.jitpack.io' }");
  const repoImport = "        maven { url 'https://raw.githubusercontent.com/iadvize/iadvize-android-sdk/master' }";
  return insertLine(inputString, `${repoImport}`, lineIndex);
}

function addCoreLibraryDesugaringActivation(inputString, language) {
  // Add option activation at the start of android block
  const lineIndex = findLineIndex(inputString, "android {") + 1;
  const optionActivation = "    compileOptions {\n        coreLibraryDesugaringEnabled true\n    }";
  return insertLine(inputString, `${optionActivation}\n`, lineIndex);
}

function addCoreLibraryDesugaringDependency(inputString, language) {
  // Add library  at the start of dependencies block
  const lineIndex = findLineIndex(inputString, "dependencies {") + 1;
  const libImport = "    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.5'";
  return insertLine(inputString, `${libImport}\n`, lineIndex);
}

function addIAdvizeAndroidImport(inputString, language) {
  // Insert the import statement right before the line containing "class MainApplication"
  const lineIndex = findLineIndex(inputString, "class MainApplication");
  const importStatement = "import com.iadvize.conversation.sdk.IAdvizeSDK";

  if (language === 'java') {
    return insertLine(inputString, `${importStatement};\n`, lineIndex);
  } else if (language === 'kt') {
    return insertLine(inputString, `${importStatement}\n`, lineIndex);
  } else {
    throw new Error('Cannot add iAdvize Android SDK: MainApplication is neither Java nor Kotlin.');
  }
}

function addIAdvizeAndroidInit(inputString, language) {
  // Insert the initiate call right after the line containing "super.onCreate()"
  const lineIndex = findLineIndex(inputString, "super.onCreate()") + 1;

  if (language === 'java') {
    const initCall = "            IAdvizeSDK.initiate(this, null);";
    return insertLine(inputString, `\n${initCall}\n`, lineIndex);
  } else if (language === 'kt') {
    const initCall = "    IAdvizeSDK.initiate(this)";
    return insertLine(inputString, `\n${initCall}\n`, lineIndex);
  } else {
    throw new Error('Cannot add iAdvize Android SDK: MainApplication is neither Java nor Kotlin.');
  }
}

function insertLine(inputString, lineToInsert, lineIndex) {
  const lines = inputString.split('\n');
  if (lineIndex < 0 || lineIndex >= lines.length) {
    throw new Error(`Cannot add iAdvize Android SDK: Line index ${lineIndex} is invalid.`);
  }
  lines.splice(lineIndex, 0, lineToInsert);
  return lines.join('\n');
}

function findLineIndex(inputString, match) {
  const lines = inputString.split('\n');
  for (const [index, line] of lines.entries()) {
    if (line.includes(match)) {
      return index;
    }
  }
  throw new Error(`Cannot add iAdvize Android SDK: Cannot find line containing ${match}.`);
}

module.exports = function withIAdvizeSdk(config) {
  config = withProjectBuildGradle(config, (config) => {
    // Add the iAdvize Android SDK repository
    config.modResults.contents = addIAdvizeRepository(config.modResults.contents, config.modResults.language);

    return config;
  });

  // Core desugaring
  config = withAppBuildGradle(config, (config) => {
    // Activate option
    config.modResults.contents = addCoreLibraryDesugaringActivation(config.modResults.contents, config.modResults.language);

    // Add dependency
    config.modResults.contents = addCoreLibraryDesugaringDependency(config.modResults.contents, config.modResults.language);

    return config;
  });

  config = withMainApplication(config, (config) => {
    // Add the iAdvize Android SDK import statement
    config.modResults.contents = addIAdvizeAndroidImport(config.modResults.contents, config.modResults.language);

    // Add the iAdvize Android SDK initiate() call
    config.modResults.contents = addIAdvizeAndroidInit(config.modResults.contents, config.modResults.language);

    return config;
  });

  return config;
};
