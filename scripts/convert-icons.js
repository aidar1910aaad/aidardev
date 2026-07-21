const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const conversions = [
    {
      input: path.join(__dirname, '../app/icon.svg'),
      output: path.join(__dirname, '../app/icon.png'),
      size: 32
    },
    {
      input: path.join(__dirname, '../app/apple-icon.svg'),
      output: path.join(__dirname, '../app/apple-icon.png'),
      size: 180
    },
    {
      input: path.join(__dirname, '../app/apple-icon.svg'),
      output: path.join(__dirname, '../app/apple-icon-152.png'),
      size: 152
    },
    {
      input: path.join(__dirname, '../app/apple-icon.svg'),
      output: path.join(__dirname, '../app/apple-icon-120.png'),
      size: 120
    },
    {
      input: path.join(__dirname, '../app/apple-icon.svg'),
      output: path.join(__dirname, '../app/apple-icon-76.png'),
      size: 76
    },
    {
      input: path.join(__dirname, '../public/og-image.svg'),
      output: path.join(__dirname, '../public/og-image.png'),
      width: 1200,
      height: 630
    },
    {
      input: path.join(__dirname, '../app/opengraph-image.svg'),
      output: path.join(__dirname, '../app/opengraph-image.png'),
      width: 1200,
      height: 630
    }
  ];

  console.log('🔄 Начинаю конвертацию SVG в PNG...\n');

  for (const conversion of conversions) {
    try {
      if (conversion.size) {
        await sharp(conversion.input)
          .resize(conversion.size, conversion.size)
          .png()
          .toFile(conversion.output);
        console.log(`✅ Создан: ${path.basename(conversion.output)} (${conversion.size}x${conversion.size})`);
      } else {
        await sharp(conversion.input)
          .resize(conversion.width, conversion.height)
          .png()
          .toFile(conversion.output);
        console.log(`✅ Создан: ${path.basename(conversion.output)} (${conversion.width}x${conversion.height})`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при конвертации ${conversion.input}:`, error.message);
    }
  }

  console.log('\n✨ Конвертация завершена!');
}

convertSvgToPng().catch(console.error);

