document.getElementById('weightForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  // كثافة الحديد بالكغ/سم3 (7.85 جم/سم3 = 0.00785 كغ/سم3)
  const steelDensity = 0.00785;

  // دالة لحساب حجم قطعة مستطيلة (الطول × العرض × التخانة)
  function volume(length, width, thickness) {
    return length * width * thickness; // بالسنتيمتر المكعب
  }

  // دالة لحساب وزن عنصر واحد (حجم × الكثافة × العدد)
  function elementWeight(length1, width1, thickness1, length2, width2, thickness2, webLength, webWidth, webThickness, count) {
    const flange1Vol = volume(length1, width1, thickness1);
    const flange2Vol = volume(length2, width2, thickness2);
    const webVol = volume(webLength, webWidth, webThickness);

    const totalVol = (flange1Vol + flange2Vol + webVol) * count;

    return totalVol * steelDensity; // بالكغ
  }

  // حساب وزن كل مجموعة
  const mainColumnsWeight = elementWeight(
    parseFloat(formData.get('main_columns_flange1_length')),
    parseFloat(formData.get('main_columns_flange1_width')),
    parseFloat(formData.get('main_columns_flange1_thickness')),
    parseFloat(formData.get('main_columns_flange2_length')),
    parseFloat(formData.get('main_columns_flange2_width')),
    parseFloat(formData.get('main_columns_flange2_thickness')),
    parseFloat(formData.get('main_columns_web_length')),
    parseFloat(formData.get('main_columns_web_width')),
    parseFloat(formData.get('main_columns_web_thickness')),
    parseInt(formData.get('main_columns_count'))
  );

  const middleColumnsWeight = elementWeight(
    parseFloat(formData.get('middle_columns_flange1_length')),
    parseFloat(formData.get('middle_columns_flange1_width')),
    parseFloat(formData.get('middle_columns_flange1_thickness')),
    parseFloat(formData.get('middle_columns_flange2_length')),
    parseFloat(formData.get('middle_columns_flange2_width')),
    parseFloat(formData.get('middle_columns_flange2_thickness')),
    parseFloat(formData.get('middle_columns_web_length')),
    parseFloat(formData.get('middle_columns_web_width')),
    parseFloat(formData.get('middle_columns_web_thickness')),
    parseInt(formData.get('middle_columns_count'))
  );

  const faceColumnsWeight = elementWeight(
    parseFloat(formData.get('face_columns_flange1_length')),
    parseFloat(formData.get('face_columns_flange1_width')),
    parseFloat(formData.get('face_columns_flange1_thickness')),
    parseFloat(formData.get('face_columns_flange2_length')),
    parseFloat(formData.get('face_columns_flange2_width')),
    parseFloat(formData.get('face_columns_flange2_thickness')),
    parseFloat(formData.get('face_columns_web_length')),
    parseFloat(formData.get('face_columns_web_width')),
    parseFloat(formData.get('face_columns_web_thickness')),
    parseInt(formData.get('face_columns_count'))
  );

  const raftersFlyingWeight = elementWeight(
    parseFloat(formData.get('rafters_flying_flange1_length')),
    parseFloat(formData.get('rafters_flying_flange1_width')),
    parseFloat(formData.get('rafters_flying_flange1_thickness')),
    parseFloat(formData.get('rafters_flying_flange2_length')),
    parseFloat(formData.get('rafters_flying_flange2_width')),
    parseFloat(formData.get('rafters_flying_flange2_thickness')),
    parseFloat(formData.get('rafters_flying_web_length')),
    parseFloat(formData.get('rafters_flying_web_width')),
    parseFloat(formData.get('rafters_flying_web_thickness')),
    parseInt(formData.get('rafters_flying_count'))
  );

  const raftersLevelWeight = elementWeight(
    parseFloat(formData.get('rafters_level_flange1_length')),
    parseFloat(formData.get('rafters_level_flange1_width')),
    parseFloat(formData.get('rafters_level_flange1_thickness')),
    parseFloat(formData.get('rafters_level_flange2_length')),
    parseFloat(formData.get('rafters_level_flange2_width')),
    parseFloat(formData.get('rafters_level_flange2_thickness')),
    parseFloat(formData.get('rafters_level_web_length')),
    parseFloat(formData.get('rafters_level_web_width')),
    parseFloat(formData.get('rafters_level_web_thickness')),
    parseInt(formData.get('rafters_level_count'))
  );

  const raftersFlyingAfterWeight = elementWeight(
    parseFloat(formData.get('rafters_flying_after_flange1_length')),
    parseFloat(formData.get('rafters_flying_after_flange1_width')),
    parseFloat(formData.get('rafters_flying_after_flange1_thickness')),
    parseFloat(formData.get('rafters_flying_after_flange2_length')),
    parseFloat(formData.get('rafters_flying_after_flange2_width')),
    parseFloat(formData.get('rafters_flying_after_flange2_thickness')),
    parseFloat(formData.get('rafters_flying_after_web_length')),
    parseFloat(formData.get('rafters_flying_after_web_width')),
    parseFloat(formData.get('rafters_flying_after_web_thickness')),
    parseInt(formData.get('rafters_flying_after_count'))
  );

  // حساب الوزن الكلي
  // نكرر وزن الرافترات الطيارة مرتين (قبل وبعد السلبة)
  const totalWeight = mainColumnsWeight + middleColumnsWeight + faceColumnsWeight + raftersLevelWeight + raftersFlyingWeight * 2 + raftersFlyingAfterWeight;

  // البلتات (12% من الوزن)
  const platesWeight = totalWeight * 0.12;

  // طباعة النتائج
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <p>وزن الأعمدة الرئيسية: ${mainColumnsWeight.toFixed(2)} كغ</p>
    <p>وزن الأعمدة الوسط: ${middleColumnsWeight.toFixed(2)} كغ</p>
    <p>وزن الأعمدة الوجهة: ${faceColumnsWeight.toFixed(2)} كغ</p>
    <p>وزن الرافترات العدل: ${raftersLevelWeight.toFixed(2)} كغ</p>
    <p>وزن الرافترات الطيارة (قبل وبعد السلبة): ${(raftersFlyingWeight * 2 + raftersFlyingAfterWeight).toFixed(2)} كغ</p>
    <p><strong>الوزن الكلي: ${totalWeight.toFixed(2)} كغ</strong></p>
    <p>وزن البلتات (12%): ${platesWeight.toFixed(2)} كغ</p>
  `;

});
