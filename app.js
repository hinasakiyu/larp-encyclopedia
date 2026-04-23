// 用語データの定義（これに基づきサイドバーを生成）
const encyclopediaData = {
    universal: [
        { id: 'play_to_contribute', title: 'Play to Contribute (PtC)' },
        { id: 'play_to_win', title: 'Play to Win (PtW)' },
        { id: 'play_to_lose', title: 'Play to Lose (PtL)' },
        { id: 'play_to_lift', title: 'Play to Lift (PtLft)' },
        { id: 'immersion', title: 'イマージョン (没入感)' },
        { id: 'mitate', title: '見立て (Mitate)' },
        { id: 'persona', title: 'ペルソナ (Persona)' },
        { id: 'projection', title: '投影 (Projection)' },
        { id: 'bleed', title: 'ブリード (Bleed)' },
        { id: 'ic_ooc', title: 'IC / OOC' },
        { id: 'time_in', title: 'タイムイン' },
        { id: 'time_out', title: 'タイムアウト' },
        { id: 'time_in_out', title: 'タイムイン / タイムアウト' }
    ],
    safety: [
        { id: 'safety', title: '安全管理 (Safety)' },
        { id: 'ok_check', title: 'OKチェック' },
        { id: 'veils_and_lines', title: 'ベールとライン' },
        { id: 'opt_out', title: 'オプトアウト (Opt-out)' },
        { id: 'tap_out', title: 'タップアウト (Tap Out)' },
        { id: 'check_in', title: 'チェックイン' },
        { id: 'debriefing', title: 'デブリーフィング' },
        { id: 'stop', title: 'ストップ (Stop)' },
        { id: 'medic', title: 'メディック (Medic)' },
        { id: 'character_lost', title: 'キャラクターロスト' },
        { id: 'crosshand', title: 'クロスハンド' }
    ],
    technique: [
        { id: 'diegetic', title: 'ダイエジェティック (Diegetic)' },
        { id: 'calibration', title: 'キャリブレーション' },
        { id: 'meta_communication', title: 'メタ・コミュニケーション' },
        { id: 'workshop', title: 'ワークショップ' },
        { id: 'look_down', title: 'ルックダウン (Look Down)' },
        { id: 'props', title: 'プロップ / 小道具' },
        { id: 'area_partitioning', title: 'エリア分割 (Area Partitioning)' },
        { id: 'lighting_design', title: 'ライティング演出' },
        { id: 'ambient_design', title: 'アンビエント演出' },
        { id: 'ambient_sound', title: '環境音 (Ambient Sound)' },
        { id: 'freeze', title: 'フリーズ (Freeze)' },
        { id: 'interval', title: 'インターバル (Interval)' },
        { id: 'magic_imbue', title: '魔法付与 (紐の印)' },
        { id: 'handout', title: 'ハンドアウト' }
    ],
    history: [
        { id: 'laymun_style', title: 'レイムーンスタイル' },
        { id: 'hinasaki', title: '雛咲望月' },
        { id: 'hoshikuzu', title: '星屑 (諸石敏寛)' }
    ],
    system: [
        { id: 'gm', title: 'ゲームマスター (GM)' },
        { id: 'pc', title: 'プレイヤーキャラクター (PC)' },
        { id: 'npc', title: 'ノンプレイヤーキャラクター (NPC)' },
        { id: 'seeker', title: '探求者 (Seeker)' },
        { id: 'organizer_staff', title: '主催者・運営スタッフ' },
        { id: 'memento_mori_light', title: 'メメントモリ・ライト' },
        { id: 'gakaichi', title: '我壊値 (Gakaichi)' },
        { id: 'fear_check', title: '恐怖判定 (Fear Check)' },
        { id: 'madness_temporary', title: '一時的狂気' },
        { id: 'madness_manifestation', title: '顕現狂気' },
        { id: 'check_cmd', title: '☆ チェック ☆' },
        { id: 'dcs', title: 'DCS (接触型戦闘)' },
        { id: 'ncs', title: 'NCS (非接触型戦闘)' }
    ]
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // Lucideアイコンの初期化
    lucide.createIcons();
    
    // サイドバーの生成
    renderSidebar();
    
    // 検索機能のセットアップ
    setupSearch();
    
    // ハッシュ変更の監視（戻るボタン対応）
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
});

// サイドバーの描画
function renderSidebar() {
    for (const section in encyclopediaData) {
        const container = document.getElementById(`nav-${section}`);
        if (!container) continue;
        
        // 既存の中身をクリア（再描画時用）
        container.innerHTML = '';
        
        encyclopediaData[section].forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.textContent = item.title;
            li.setAttribute('data-id', item.id);
            li.onclick = () => {
                location.hash = item.id;
            };
            container.appendChild(li);
        });
    }
}

// ルーティング処理
function handleRoute() {
    const termId = location.hash.replace('#', '');
    if (termId) {
        loadTerm(termId);
    }
}

// 用語の読み込み
async function loadTerm(id) {
    const contentArea = document.getElementById('content-area');
    
    // アクティブなナビゲーション項目の更新
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-id') === id);
    });

    try {
        // Markdownファイルのフェッチ（data/terms/ 以下のファイル）
        const response = await fetch(`./data/terms/${id}.md`);
        if (!response.ok) throw new Error('知恵が見つかりませんでした。');
        
        let markdown = await response.text();
        
        // 内部リンク（./filename.md）をハッシュ形式（#filename）に置換
        markdown = markdown.replace(/\[(.*?)\]\(\.\/(.*?)\.md\)/g, '[$1](#$2)');
        
        // MarkdownをHTMLに変換
        const htmlContent = marked.parse(markdown);
        
        // 描画（アニメーション付き）
        contentArea.style.opacity = 0;
        setTimeout(() => {
            contentArea.innerHTML = htmlContent;
            contentArea.style.opacity = 1;
            // ページトップへ
            document.getElementById('viewer').scrollTop = 0;
        }, 100);

    } catch (error) {
        contentArea.innerHTML = `<div class="error" style="text-align: center; padding-top: 4rem;">
            <h2 style="color: var(--accent); font-size: 2rem; margin-bottom: 1rem;">知恵へのアクセスに失敗しました</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${error.message}</p>
            <p style="font-size: 0.9rem; border: 1px solid var(--border); padding: 1rem; border-radius: 8px; background: var(--bg-card);">
                <strong>💡 ヒント:</strong> ローカル環境（file://）で閲覧している場合、ブラウザのセキュリティ制限により読み込みがブロックされます。
                <br>GitHub Pagesで閲覧するか、VS CodeのLive Server等をご利用ください。
            </p>
        </div>`;
    }
}

// 検索機能
function setupSearch() {
    const input = document.getElementById('search-input');

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (!query) {
            document.querySelectorAll('.nav-item').forEach(el => el.style.display = 'block');
            return;
        }

        document.querySelectorAll('.nav-item').forEach(el => {
            const text = el.textContent.toLowerCase();
            el.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}
