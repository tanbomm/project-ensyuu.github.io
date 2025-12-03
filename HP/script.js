// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {

    // --- 要素の取得 ---
    const printButton = document.getElementById('printButton');
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const form = document.getElementById('timelineForm');
    const allRadios = document.querySelectorAll('input[type="radio"]');

    // ▼▼▼ 変更点 ▼▼▼
    // 各ラジオボタングループ（name属性）で、現在選択されている要素を記録します
    let radioStates = {};

    /**
     * 現在のフォームのラジオボタンの選択状態をスキャンして、
     * radioStatesオブジェクトを最新の状態に更新します。
     */
    function updateRadioStates() {
        radioStates = {}; // 状態をリセット
        allRadios.forEach(radio => {
            if (radio.checked) {
                radioStates[radio.name] = radio; // { "support": <element>, "flood": <element>, ... }
            }
        });
    }
    // ▲▲▲ ここまで ▲▲▲


    // --- 1. 印刷ボタンの機能 ---
    printButton.addEventListener('click', () => {
        // ブラウザの印刷機能を呼び出す
        window.print();
    });

    // --- 2. 保存ボタンの機能 ---
    saveButton.addEventListener('click', () => {
        if (!form) return;

        // フォーム内のすべての入力要素を取得
        const inputs = form.querySelectorAll('input, textarea');
        const dataToSave = {};

        inputs.forEach(input => {
            const id = input.dataset.id; // HTMLで設定した data-id をキーにする
            if (!id) return; // data-id がない要素は無視

            if (input.type === 'checkbox' || input.type === 'radio') {
                dataToSave[id] = input.checked;
            } else {
                dataToSave[id] = input.value;
            }
        });

        // データをJSON文字列に変換してlocalStorageに保存
        try {
            localStorage.setItem('myTimelineData', JSON.stringify(dataToSave));
            alert('入力内容をブラウザに一時保存しました。');
        } catch (e) {
            console.error('保存に失敗しました:', e);
            alert('保存に失敗しました。ブラウザのストレージ容量がいっぱいか、設定が無効になっている可能性があります。');
        }
    });

    // --- 3. 復元ボタンの機能 ---
    loadButton.addEventListener('click', () => {
        if (!form) return;

        // localStorageからデータを取得
        const savedData = localStorage.getItem('myTimelineData');
        if (!savedData) {
            alert('保存されたデータがありません。');
            return;
        }

        try {
            const dataToLoad = JSON.parse(savedData);

            // フォーム内のすべての入力要素にデータを復元
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const id = input.dataset.id;
                if (!id || dataToLoad[id] === undefined) return;

                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = dataToLoad[id];
                } else {
                    input.value = dataToLoad[id];
                }
            });

            // ▼▼▼ 変更点 ▼▼▼
            // データを復元した後、ラジオボタンの状態を再スキャンします
            updateRadioStates();
            // ▲▲▲ ここまで ▲▲▲

            alert('保存された内容を復元しました。');
        } catch (e) {
            console.error('復元に失敗しました:', e);
            alert('データの復元に失敗しました。');
        }
    });


    // ▼▼▼ 4. ラジオボタンの選択解除ロジック（新規追加） ▼▼▼
    allRadios.forEach(radio => {
        radio.addEventListener('click', function() {
            const groupName = this.name;
            if (!groupName) return; // name属性がないラジオボタンは対象外

            // 記録されている「前回の選択」と「今回のクリック」が同じ要素か？
            if (radioStates[groupName] === this) {
                // 同じ場合： 2回目のクリックとみなし、選択を解除
                this.checked = false;
                radioStates[groupName] = null; // 記録をリセット
            } else {
                // 違う場合： 新しい選択とみなし、今回の要素を記録
                radioStates[groupName] = this;
            }
        });
    });

    // ▼▼▼ 5. ページ読み込み時の初期スキャン（新規追加） ▼▼▼
    // ブラウザが前の選択を記憶している場合（リロード時など）に備えて、
    // ページ読み込み時に一度、現在の状態をスキャンしておきます。
    updateRadioStates();

});

// 既存の script.js の内容

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. タイムラインフォーム (page-timeline) の処理 ---
    if (document.body.classList.contains('page-timeline')) {
        
        const saveButton = document.getElementById('saveButton');
        const loadButton = document.getElementById('loadButton');
        const form = document.getElementById('timelineForm');
        const allRadios = document.querySelectorAll('input[type="radio"]');
        let radioStates = {};
        
        function updateRadioStates() { /* ... (既存のまま) ... */ }

        // ▼▼▼ 保存ボタンの処理を変更 ▼▼▼
        saveButton.addEventListener('click', () => {
            if (!form) return;
            const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"], textarea, input[type="radio"]:checked, input[type="checkbox"]');
            const dataToSave = {};

            inputs.forEach(input => {
                const id = input.dataset.id;
                if (!id) return;

                if (input.type === 'checkbox' || input.type === 'radio') {
                    dataToSave[id] = input.checked;
                } else {
                    dataToSave[id] = input.value;
                }
            });

            try {
                localStorage.setItem('myTimelineData', JSON.stringify(dataToSave));
                // alert('入力内容を一時保存しました。'); // アラートの代わりに画面遷移
                
                // 保存後、確認画面 (evaluation.html) に移動する
                window.location.href = 'evaluation.html'; 
                
            } catch (e) {
                console.error('保存に失敗しました:', e);
                alert('保存に失敗しました。');
            }
        });
        // ▲▲▲ 保存ボタンの処理ここまで ▲▲▲

        loadButton.addEventListener('click', () => { /* ... (既存のまま) ... */ });
        allRadios.forEach(radio => { /* ... (既存のまま) ... */ });
        updateRadioStates();
    } // --- タイムラインフォームの処理ここまで ---


    // --- 2. 印刷ボタン (共通) の処理 ---
    // (タイムラインと確認画面の両方で使うため、ifの外に出す)
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    
    // ▼▼▼ 3. 確認・評価 (page-evaluation) の処理 (新規追加) ▼▼▼
    if (document.body.classList.contains('page-evaluation')) {
        
        // localStorageからデータを読み込む
        const savedData = localStorage.getItem('myTimelineData');
        if (!savedData) {
            alert('表示するデータがありません。先にタイムラインを作成してください。');
            window.location.href = 'timeline.html'; // フォームページに戻す
            return;
        }

        const data = JSON.parse(savedData);

        // --- データ表示用のヘルパー関数 ---
        const setText = (id, key) => {
            const el = document.getElementById(id);
            if (el) el.textContent = data[key] || '---';
        };
        // リスト表示用のヘルパー
        const setList = (listId, items) => {
            const ul = document.getElementById(listId);
            if (!ul) return;
            ul.innerHTML = ''; // 中身をリセット
            let hasCheckedItem = false;
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.label;
                if (data[item.id]) {
                    li.className = 'checked';
                    hasCheckedItem = true;
                } else {
                    li.className = 'not-checked';
                }
                ul.appendChild(li);
            });
            if (!hasCheckedItem) ul.innerHTML = '<li>チェックされた項目はありません</li>';
        };

        // --- 1. 家族情報テーブル ---
        const familyTbody = document.getElementById('eval-family-table');
        if (familyTbody) {
            for (let i = 1; i <= 4; i++) {
                if (data['name' + i]) { // 名前が入力されている行のみ表示
                    const tr = `<tr>
                        <td>${data['name' + i] || '---'}</td>
                        <td>${data['age' + i] || '---'}</td>
                        <td>${data['tel' + i] || '---'}</td>
                        <td>${data['other' + i] || '---'}</td>
                    </tr>`;
                    familyTbody.innerHTML += tr;
                }
            }
        }
        
        // --- 2. 避難支援 ---
        const supportEl = document.getElementById('eval-support');
        if (supportEl) {
            supportEl.textContent = data.support_yes ? `いる (${data.support_detail || '詳細未入力'})` : 'いない';
        }

        // --- 3. ハザードマップ ---
        let floodText = data.flood_yes ? `洪水あり (${data.flood_detail || '詳細未入力'})` : '洪水なし';
        if (data.surge_yes) floodText += ` / 高潮あり (${data.surge_detail || '詳細未入力'})`;
        setText('eval-flood', floodText); // setTextはID指定なので、直接テキストを渡すよう変更
        document.getElementById('eval-flood').textContent = floodText;
        document.getElementById('eval-landslide').textContent = data.landslide_yes ? 'あり' : 'なし';

        // --- 4. 避難先 ---
        setList('eval-dest-list', [
            { id: 'dest_shelter_check', label: `指定緊急避難場所 (${data.dest_shelter_text || '未入力'})` },
            { id: 'dest_relative_check', label: `親戚や知人の家 (${data.dest_relative_text || '未入力'})` },
            { id: 'dest_building_check', label: '頑丈な建物（マンションなど）' },
            { id: 'dest_hotel_check', label: `宿泊施設など (${data.dest_hotel_text || '未入力'})` },
            { id: 'dest_home_check', label: '自宅の上階（垂直避難）' },
            { id: 'dest_other_check', label: `その他 (${data.dest_other_text || '未入力'})` }
        ]);

        // --- 5. 情報の入手方法 ---
        setList('eval-info-list', [
            { id: 'info_tv', label: 'TV・ラジオ' },
            { id: 'info_web', label: '自治体ホームページ' },
            { id: 'info_mail', label: '防災メール' },
            { id: 'info_line', label: '自治体LINE' },
            { id: 'info_app', label: '防災アプリ' },
            { id: 'info_jma', label: '気象庁ホームページ' },
            { id: 'info_other_check', label: `その他 (${data.info_other_text || '未入力'})` }
        ]);
        
        // --- 6. 持出品 ---
        setList('eval-item-list', [
            { id: 'item_food', label: '食料・飲料水' }, { id: 'item_med', label: '常備薬・救急セット' },
            { id: 'item_cash', label: '現金・身分証明書' }, { id: 'item_light', label: '懐中電灯' },
            { id: 'item_radio', label: '携帯ラジオ' }, { id: 'item_battery', label: 'モバイルバッテリー' },
            { id: 'item_glasses', label: 'メガネ・コンタクト' }, { id: 'item_clothes', label: '着替え・下着' },
            { id: 'item_rain', label: '雨具' }, { id: 'item_towel', label: 'タオル・毛布' },
            { id: 'item_bag', label: 'ビニール袋' }, { id: 'item_toilet', label: '携帯用トイレ' },
            { id: 'item_baby', label: '乳児用ミルク・おむつ' }, { id: 'item_mask', label: '生理用品・マスク' }
        ]);
        setText('eval-item-custom', 'item_custom');

        // --- 7. 連絡先 ---
        const contactTbody = document.getElementById('eval-contact-table');
        if (contactTbody) {
            for (let i = 1; i <= 3; i++) {
                if (data['contact_name' + i]) {
                    const tr = `<tr>
                        <td>${data['contact_name' + i]}</td>
                        <td>${data['contact_tel' + i] || '---'}</td>
                    </tr>`;
                    contactTbody.innerHTML += tr;
                }
            }
        }
        
        // --- 8. 独自タイミング ---
        setText('eval-custom-timing', 'custom_timing');
        
        // --- 9. タイムライン本体 ---
        setText('eval-timeline1', 'timeline1');
        setText('eval-timeline2', 'timeline2');
        setText('eval-timeline3', 'timeline3');
        setText('eval-timeline4', 'timeline4');
        setText('eval-timeline5', 'timeline5');
    }
    // ▲▲▲ 確認・評価の処理ここまで ▲▲▲


}); // DOMContentLoaded の終わり