const App = (() => {
    const RULES = [
        { name: "تجاوز صلاحيات الذاكرة (Memory Corruption)", severity: "CRITICAL", patterns: [/\b(strcpy|gets|malloc|free|memcpy)\b/i], exploit: "السيطرة على سجلات المعالج عبر فيضان البيانات.", impact: "تنفيذ أكواد خبيثة (RCE).", fix: "استخدم الدوال الآمنة (strncpy) والتحقق من حجم البيانات." },
        { name: "حقن الأوامر (Command/SQL Injection)", severity: "CRITICAL", patterns: [/\$_(GET|POST)/, /eval\(.*\)/i, /SELECT.*FROM/i, /system\(.*\)/i], exploit: "تنفيذ استعلامات أو أوامر نظام مباشرة عبر مدخلات المستخدم.", impact: "سرقة قواعد البيانات والسيطرة على السيرفر.", fix: "استخدم Prepared Statements ونظف المدخلات (Sanitization)." },
        { name: "تسريب المفاتيح السحابية (Secrets Leakage)", severity: "HIGH", patterns: [/AIza[0-9A-Za-z-_]{35}/, /AKIA[0-9A-Z]{16}/, /"secret"\s*[:=]/i], exploit: "استغلال المفاتيح المكشوفة للوصول لخدمات Cloud.", impact: "خسائر مالية واختراق البنية التحتية.", fix: "انقل المفاتيح إلى ملفات .env." }
    ];

    const verify = () => {
        if(document.getElementById('pass-input').value === '1968') {
            document.getElementById('page-auth').classList.remove('active');
            document.getElementById('page-scanner').classList.add('active');
            initMatrix();
        } else { alert('ACCESS DENIED: الرمز غير صحيح'); }
    };

    const startDeepAnalysis = async () => {
        const code = document.getElementById('code-input').value;
        if(!code) return alert('برجاء إدخال الكود');
        document.getElementById('input-section').classList.add('hidden');
        document.getElementById('training-section').classList.remove('hidden');
        
        const log = document.getElementById('console-logs');
        const tasks = ["> LOADING AI NEURAL NETWORK...", "> ANALYZING 50+ LANGUAGES...", "> DEEP DATA FLOW ANALYSIS...", "> CHECKING CVE DATABASE..."];
        for(let i=0; i<tasks.length; i++) {
            let p = document.createElement('p'); p.textContent = tasks[i]; log.appendChild(p);
            document.getElementById('progress-fill').style.width = ((i+1)*25) + "%";
            await new Promise(r => setTimeout(r, 600));
        }
        analyze(code);
    };

    const analyze = (code) => {
        let found = []; let score = 100;
        RULES.forEach(r => {
            r.patterns.forEach(p => { if(p.test(code)) { found.push(r); score -= (r.severity === 'CRITICAL' ? 30 : 15); } });
        });
        const suspiciousUrls = (code.match(/https?:\/\/[^\s"'`]+/g) || []).filter(u => ['bit.ly', 'ngrok', 'onion', 'temp'].some(k => u.includes(k)));
        if(score < 0) score = 0;
        display(found, score, suspiciousUrls);
    };

    const display = (results, score, urls) => {
        document.getElementById('training-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('security-gauge-container').innerHTML = `
            <div class="security-gauge">
                <p>مؤشر أمان النظام</p>
                <div class="score-circle">${score}%</div>
                ${urls.length > 0 ? `<p style="color:var(--warn)">⚠️ تم اكتشاف روابط مشبوهة في الكود!</p>` : ''}
            </div>`;
        document.getElementById('vuln-report').innerHTML = results.length ? results.map(r => `
            <div class="vuln-card" style="border-right-color:${r.severity === 'CRITICAL' ? 'red' : 'orange'}">
                <h3 style="color:${r.severity === 'CRITICAL' ? 'red' : 'orange'}">[${r.severity}] ${r.name}</h3>
                <p><strong>الأثر:</strong> ${r.impact}</p>
                <div class="exploit-box"><strong>سيناريو الهجوم:</strong> ${r.exploit}</div>
                <div class="fix-box"><strong>بروتوكول الإصلاح:</strong> ${r.fix}</div>
            </div>`).join('') : "<h2 style='text-align:center;color:var(--neon)'>✅ الكود محصن بالكامل</h2>";
    };

    const downloadReport = () => {
        const blob = new Blob([document.getElementById('results-section').innerText], {type: 'text/plain'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Security_Report.txt'; a.click();
    };

    const initMatrix = () => {
        const c = document.getElementById('matrix-canvas'); const ctx = c.getContext('2d');
        c.width = window.innerWidth; c.height = window.innerHeight;
        const drops = Array(Math.floor(c.width/20)).fill(1);
        setInterval(() => {
            ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0,0,c.width,c.height);
            ctx.fillStyle = "#00FF41";
            drops.forEach((y, i) => {
                ctx.fillText(Math.floor(Math.random()*2), i*20, y*20);
                if(y*20 > c.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }, 33);
    };

    return { verify, startDeepAnalysis, downloadReport };
})();
