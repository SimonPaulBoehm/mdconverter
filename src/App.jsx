import { useState, useRef, useCallback } from "react";
import { marked } from "marked";

const KONAYUKI_LIGHT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Source+Code+Pro:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{
  margin:0;padding:0;
  background:#f5f5f0;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
body{
  margin:0;padding:0;
  background:#f5f5f0;
  color:#333;
  font-family:'Source Serif 4',Georgia,serif;
  font-size:16px;line-height:1.85;
  -webkit-font-smoothing:antialiased;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
#write{
  max-width:800px;margin:0 auto;
  padding:60px 72px 80px;
  min-height:100vh;
  background:#ffffff;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
h1,h2,h3,h4,h5,h6{font-family:'Source Serif 4',Georgia,serif;font-weight:600;line-height:1.3;margin:1.8em 0 .65em;}
h1{font-size:2em;font-weight:700;color:#1a1a1a;border-bottom:2px solid #d0cfc8;padding-bottom:.35em;margin-top:.5em;letter-spacing:-.025em;}
h2{font-size:1.5em;color:#2a2a2a;border-bottom:1px solid #e4e3dc;padding-bottom:.25em;}
h3{font-size:1.2em;color:#3a3a3a;}
h4{font-size:1.05em;font-style:italic;}
h5,h6{font-size:.95em;color:#666;text-transform:uppercase;letter-spacing:.06em;}
p{margin:0 0 1.1em;}
a{color:#4078c0;text-decoration:none;border-bottom:1px solid rgba(64,120,192,.3);}
strong{font-weight:700;color:#1a1a1a;}
em{font-style:italic;color:#555;}
mark{background:#fff3b0;padding:0 2px;border-radius:2px;}
code{font-family:'Source Code Pro',monospace;font-size:.875em;background:#f0efea;color:#555;padding:.1em .4em;border-radius:4px;border:1px solid #e4e3dc;}
pre{background:#f0efea;border:1px solid #d0cfc8;border-radius:8px;padding:1.1em 1.4em;margin:1.4em 0;overflow-x:auto;line-height:1.6;}
pre code{background:none;border:none;padding:0;font-size:.86em;color:#444;}
blockquote{border-left:4px solid #a0b8d8;background:#edf2f9;margin:1.4em 0;padding:.8em 1.3em;border-radius:0 6px 6px 0;color:#5a6a7a;font-style:italic;}
blockquote p:last-child{margin-bottom:0;}
ul,ol{padding-left:1.8em;margin:0 0 1.1em;}
li{margin-bottom:.35em;}
table{width:100%;border-collapse:collapse;margin:1.4em 0;font-size:.94em;border:1px solid #d8d6cf;overflow:hidden;}
thead{background:#eceae4;}
th{padding:.55em .9em;text-align:left;font-weight:600;font-size:.88em;color:#555;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #d8d6cf;}
td{padding:.5em .9em;border-bottom:1px solid #e4e3dc;}
tr:last-child td{border-bottom:none;}
tr:nth-child(even) td{background:#f8f7f3;}
hr{border:none;border-top:1px solid #d0cfc8;margin:2.2em 0;}
img{max-width:100%;border-radius:6px;display:block;margin:.5em auto;}
.kh{display:flex;justify-content:space-between;padding-bottom:.6em;margin-bottom:2em;border-bottom:1px solid #e4e3dc;font-family:'Source Code Pro',monospace;font-size:.72em;color:#aaa;letter-spacing:.04em;}
.kf{display:flex;justify-content:space-between;padding-top:.6em;margin-top:3em;border-top:1px solid #e4e3dc;font-family:'Source Code Pro',monospace;font-size:.72em;color:#aaa;letter-spacing:.04em;}
@media print{
  /* Zero out @page margins — padding on #write handles spacing */
  @page { size:A4; margin:0; }
  html,body{
    background:#f5f5f0 !important;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  #write{
    max-width:100% !important;
    padding:20mm 22mm !important;
    box-shadow:none !important;
    background:#ffffff !important;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
}`;

const KONAYUKI_DARK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Source+Code+Pro:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{
  margin:0;padding:0;
  background:#1c1e24;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
body{
  margin:0;padding:0;
  background:#1c1e24;
  color:#c9c5bb;
  font-family:'Source Serif 4',Georgia,serif;
  font-size:16px;line-height:1.85;
  -webkit-font-smoothing:antialiased;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
#write{
  max-width:800px;margin:0 auto;
  padding:60px 72px 80px;
  min-height:100vh;
  background:#22252e;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
h1,h2,h3,h4,h5,h6{font-family:'Source Serif 4',Georgia,serif;font-weight:600;line-height:1.3;margin:1.8em 0 .65em;}
h1{font-size:2em;font-weight:700;color:#e2ddd5;border-bottom:2px solid #343740;padding-bottom:.35em;margin-top:.5em;letter-spacing:-.025em;}
h2{font-size:1.5em;color:#d2cdc5;border-bottom:1px solid #2c2f38;padding-bottom:.25em;}
h3{font-size:1.2em;color:#c2bdb5;}
h4{font-size:1.05em;font-style:italic;color:#c9c5bb;}
h5,h6{font-size:.95em;color:#66707a;text-transform:uppercase;letter-spacing:.06em;}
p{margin:0 0 1.1em;}
a{color:#7aaddc;text-decoration:none;border-bottom:1px solid rgba(122,173,220,.3);}
strong{font-weight:700;color:#e2ddd5;}
em{font-style:italic;color:#8a9aaa;}
mark{background:#4a4220;padding:0 2px;border-radius:2px;color:#d8c878;}
code{font-family:'Source Code Pro',monospace;font-size:.875em;background:#13151a;color:#9ec4e0;padding:.1em .4em;border-radius:4px;border:1px solid #2c2f38;}
pre{background:#13151a;border:1px solid #343740;border-radius:8px;padding:1.1em 1.4em;margin:1.4em 0;overflow-x:auto;line-height:1.6;}
pre code{background:none;border:none;padding:0;font-size:.86em;color:#a0b8c8;}
blockquote{border-left:4px solid #4a7fb5;background:#1e2a38;margin:1.4em 0;padding:.8em 1.3em;border-radius:0 6px 6px 0;color:#8a9eb4;font-style:italic;}
blockquote p:last-child{margin-bottom:0;}
ul,ol{padding-left:1.8em;margin:0 0 1.1em;}
li{margin-bottom:.35em;}
table{width:100%;border-collapse:collapse;margin:1.4em 0;font-size:.94em;border:1px solid #343740;overflow:hidden;}
thead{background:#13151a;}
th{padding:.55em .9em;text-align:left;font-weight:600;font-size:.88em;color:#66707a;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #343740;}
td{padding:.5em .9em;border-bottom:1px solid #2c2f38;}
tr:last-child td{border-bottom:none;}
tr:nth-child(even) td{background:#1a1c22;}
hr{border:none;border-top:1px solid #343740;margin:2.2em 0;}
img{max-width:100%;border-radius:6px;display:block;margin:.5em auto;}
.kh{display:flex;justify-content:space-between;padding-bottom:.6em;margin-bottom:2em;border-bottom:1px solid #2c2f38;font-family:'Source Code Pro',monospace;font-size:.72em;color:#3a4050;letter-spacing:.04em;}
.kf{display:flex;justify-content:space-between;padding-top:.6em;margin-top:3em;border-top:1px solid #2c2f38;font-family:'Source Code Pro',monospace;font-size:.72em;color:#3a4050;letter-spacing:.04em;}
@media print{
  /* Zero @page margins — #write padding handles all spacing */
  @page { size:A4; margin:0; }
  html,body{
    background:#1c1e24 !important;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  #write{
    max-width:100% !important;
    padding:20mm 22mm !important;
    min-height:100vh !important;
    box-shadow:none !important;
    background:#22252e !important;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
}`;

const DEFAULT_THEMES = [
  { id:"konayuki-light", name:"Konayuki Light", css:KONAYUKI_LIGHT_CSS, dark:false },
  { id:"konayuki-dark",  name:"Konayuki Dark",  css:KONAYUKI_DARK_CSS,  dark:true  },
];

function extractBody(html) {
  if (!html.trim()) return "";
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : html;
}

function buildDoc(html, theme, { title, date, showHeader, showFooter }) {
  const body = extractBody(html) || `<p style="color:#888;font-style:italic">No content yet.</p>`;
  const hdr = showHeader ? `<div class="kh"><span>${title}</span><span>${date}</span></div>` : "";
  const ftr = showFooter ? `<div class="kf"><span>${title}</span><span>Konayuki PDF</span></div>` : "";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${theme.css}</style>
</head>
<body>
<div id="write">
${hdr}
${body}
${ftr}
</div>
</body>
</html>`;
}

export default function App() {
  const [html, setHtml]             = useState("");
  const [inputMode, setInputMode]   = useState("html"); // "html" | "markdown"
  const [themes, setThemes]         = useState(DEFAULT_THEMES);
  const [themeId, setThemeId]       = useState("konayuki-light");
  const [title, setTitle]           = useState("Document");
  const [date, setDate]             = useState(new Date().toISOString().slice(0,10));
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [tab, setTab]               = useState("input");
  const [dragOver, setDragOver]     = useState(false);
  const [customName, setCustomName] = useState("");
  const [toast, setToast]           = useState(null);

  const fileRef  = useRef(null);
  const themeRef = useRef(null);

  const theme = themes.find(t => t.id === themeId) || themes[0];

  const notify = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadHtml = useCallback(file => {
    if (!file) return;
    const isMd   = file.name.match(/\.md$/i);
    const isHtml = file.name.match(/\.(html?|htm)$/i);
    if (!isMd && !isHtml) { notify("Upload an .html or .md file","error"); return; }
    const r = new FileReader();
    r.onload = ev => {
      setHtml(ev.target.result);
      setTitle(file.name.replace(/\.(html?|htm|md)$/i,""));
      if (isMd) setInputMode("markdown");
      else setInputMode("html");
      notify(`Loaded ${file.name}`);
      setTab("preview");
    };
    r.readAsText(file);
  }, []);

  const loadCss = useCallback(file => {
    if (!file) return;
    if (!file.name.match(/\.css$/i)) { notify("Upload a .css file","error"); return; }
    const r = new FileReader();
    r.onload = ev => {
      const id   = `custom-${Date.now()}`;
      const name = customName.trim() || file.name.replace(/\.css$/i,"");
      setThemes(p => [...p, { id, name, css:ev.target.result, dark:false }]);
      setThemeId(id);
      setCustomName("");
      notify(`Theme added: ${name}`);
    };
    r.readAsText(file);
  }, [customName]);

  const renderedHtml = inputMode === "markdown" ? marked.parse(html) : html;
  const doc = buildDoc(renderedHtml, theme, { title, date, showHeader, showFooter });

  const handlePrint = () => {
    const w = window.open("","_blank");
    w.document.write(doc);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 700);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html, body, #root { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#1a1c20; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#2e3240; border-radius:3px; }
      `}</style>

      {toast && (
        <div style={{
          position:"fixed", top:14, right:14, zIndex:9999,
          padding:"8px 15px", borderRadius:8, fontSize:12.5,
          boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
          background: toast.type==="error" ? "#3a1a1a" : "#1a3a28",
          color:       toast.type==="error" ? "#cf5d5d" : "#5dcf8a",
          border:`1px solid ${toast.type==="error" ? "#5a2a2a" : "#2a5a3a"}`
        }}>{toast.msg}</div>
      )}

      <div style={{
        display:"flex", flexDirection:"column",
        width:"100vw", height:"100vh",
        background:"#1a1c20",
        fontFamily:"'Inter',system-ui,sans-serif",
        color:"#c8c4bc",
        overflow:"hidden"
      }}>
        {/* Topbar */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          height:48, padding:"0 16px",
          background:"#111316", borderBottom:"1px solid #252830",
          flexShrink:0, gap:12, zIndex:10
        }}>
          <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {[[12,2,12,22],[2,12,22,12],[4.5,4.5,19.5,19.5],[19.5,4.5,4.5,19.5]].map(([x1,y1,x2,y2],i)=>(
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5a9fd4" strokeWidth="1.8" strokeLinecap="round"/>
              ))}
              {[[12,2],[12,22],[2,12],[22,12]].map(([cx,cy],i)=>(
                <circle key={i} cx={cx} cy={cy} r="1.8" fill="#5a9fd4"/>
              ))}
            </svg>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"#e8e4dc",letterSpacing:"-0.02em",lineHeight:1.2}}>Konayuki PDF</div>
              <div style={{fontSize:10,color:"#3a4050",lineHeight:1.2}}>HTML → Themed PDF</div>
            </div>
          </div>

          <div style={{display:"flex",gap:3,background:"#1e2025",borderRadius:8,padding:3}}>
            {[["input","✏ Input"],["preview","👁 Preview"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                background: tab===id ? "#2e3240" : "none",
                border:"none", color: tab===id ? "#e0dcd4" : "#555",
                fontSize:12.5, fontFamily:"inherit", padding:"5px 14px", borderRadius:6,
                cursor:"pointer", fontWeight: tab===id ? 600 : 400
              }}>{label}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>setTab(t=>t==="input"?"preview":"input")} style={{
              background:"#252830", border:"1px solid #2e3240", color:"#aaa",
              borderRadius:7, padding:"6px 13px", fontSize:12.5, fontFamily:"inherit",
              fontWeight:500, cursor:"pointer"
            }}>{tab==="input" ? "Preview →" : "← Edit"}</button>
            <button onClick={handlePrint} disabled={!html.trim()} style={{
              background: html.trim() ? "#3a6fb0" : "#252830",
              border: html.trim() ? "none" : "1px solid #2e3240",
              color: html.trim() ? "#fff" : "#555",
              borderRadius:7, padding:"6px 14px", fontSize:12.5, fontFamily:"inherit",
              fontWeight:500, cursor: html.trim() ? "pointer" : "default",
              display:"flex", alignItems:"center", gap:6
            }}>🖨 Print / Save PDF</button>
          </div>
        </div>

        {/* Body */}
        <div style={{display:"flex", flex:1, overflow:"hidden", minHeight:0}}>

          {/* Sidebar */}
          <div style={{
            width:256, minWidth:240, background:"#14161a",
            borderRight:"1px solid #1e2025", overflowY:"auto", flexShrink:0
          }}>
            <SideSection label="Theme">
              {themes.map(t=>(
                <button key={t.id} onClick={()=>setThemeId(t.id)} style={{
                  display:"flex", alignItems:"center", gap:8, width:"100%",
                  padding:"7px 9px", borderRadius:6, cursor:"pointer", fontSize:12.5,
                  textAlign:"left", fontFamily:"inherit", marginBottom:3,
                  border: themeId===t.id ? "1px solid #2a4060" : "1px solid transparent",
                  background: themeId===t.id ? "#1e2a3a" : "none",
                  color: themeId===t.id ? "#7aaddc" : "#777",
                }}>
                  <span style={{width:7,height:7,borderRadius:"50%",flexShrink:0,
                    background: t.dark ? "#4a7fb5" : "#7aaddc"}}/>
                  {t.name}
                </button>
              ))}
            </SideSection>

            <SideSection label="Custom Theme">
              <input type="text" value={customName} onChange={e=>setCustomName(e.target.value)}
                placeholder="Theme name (optional)" style={inputStyle}/>
              <div onClick={()=>themeRef.current?.click()} style={{
                border:"1px dashed #2e3240", borderRadius:7, padding:"9px 10px",
                textAlign:"center", cursor:"pointer", fontSize:11.5, color:"#444",
                background:"#1a1c20", marginTop:7
              }}>↑ Upload CSS file</div>
              <input ref={themeRef} type="file" accept=".css" style={{display:"none"}}
                onChange={e=>{loadCss(e.target.files?.[0]); e.target.value="";}}/>
              <p style={{fontSize:10,color:"#333",lineHeight:1.6,marginTop:7}}>
                Any Typora-compatible CSS. Appended to theme list.
              </p>
            </SideSection>

            <SideSection label="Document">
              <label style={labelStyle}>Title</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="Document title" style={{...inputStyle,marginBottom:9}}/>
              <label style={labelStyle}>Date</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle}/>
            </SideSection>

            <SideSection label="Page Elements">
              {[["Header bar",showHeader,setShowHeader],["Footer bar",showFooter,setShowFooter]].map(([l,v,s])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                  <span style={{fontSize:12.5,color:"#777"}}>{l}</span>
                  <Toggle val={v} set={s}/>
                </div>
              ))}
            </SideSection>

            <SideSection label="PDF Tip" last>
              <p style={{fontSize:11,color:"#3a4050",lineHeight:1.8,margin:0}}>
                In the Print dialog, set <strong style={{color:"#5a7090"}}>Margins → None</strong> (or Custom 0) and enable <strong style={{color:"#5a7090"}}>Background graphics</strong> to get a full-bleed colored PDF.
              </p>
            </SideSection>
          </div>

          {/* Content */}
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            overflow:"hidden", minWidth:0, minHeight:0, background:"#1a1c20"
          }}>
            {tab === "input" ? (
              <div style={{
                flex:1, display:"flex", flexDirection:"column",
                padding:18, gap:14, overflowY:"auto", background:"#1a1c20"
              }}>
                <div
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);loadHtml(e.dataTransfer.files?.[0]);}}
                  onClick={()=>fileRef.current?.click()}
                  style={{
                    border:`2px dashed ${dragOver?"#3a6fb0":"#252830"}`,
                    borderRadius:10, padding:"26px 20px", textAlign:"center",
                    cursor:"pointer", flexShrink:0, transition:"all .15s",
                    background: dragOver ? "#192030" : "#111316"
                  }}
                >
                  <div style={{fontSize:28,marginBottom:6}}>📄</div>
                  <div style={{fontWeight:600,fontSize:13.5,color:"#555",marginBottom:3}}>Drop file here</div>
                  <div style={{fontSize:11.5,color:"#333"}}>or click to browse · .html / .htm / .md</div>
                  <input ref={fileRef} type="file" accept=".html,.htm,.md" style={{display:"none"}}
                    onChange={e=>{loadHtml(e.target.files?.[0]); e.target.value="";}}/>
                </div>

                <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:200}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#3a4050"}}>
                      Or paste content
                    </div>
                    <div style={{display:"flex",gap:2,background:"#1e2025",borderRadius:6,padding:2}}>
                      {[["html","HTML"],["markdown","Markdown"]].map(([id,label])=>(
                        <button key={id} onClick={()=>setInputMode(id)} style={{
                          background: inputMode===id ? "#2e3240" : "none",
                          border:"none", color: inputMode===id ? "#e0dcd4" : "#555",
                          fontSize:11, fontFamily:"inherit", padding:"3px 10px", borderRadius:5,
                          cursor:"pointer", fontWeight: inputMode===id ? 600 : 400
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={html}
                    onChange={e=>setHtml(e.target.value)}
                    placeholder={inputMode === "markdown"
                      ? "# My Document\n\nPaste **Markdown** here..."
                      : "<h1>My Document</h1>\n<p>Paste exported HTML here...</p>"}
                    style={{
                      flex:1, minHeight:220, background:"#111316",
                      border:"1px solid #1e2025", borderRadius:8,
                      padding:"12px 14px", color:"#8a9aaa",
                      fontFamily:"'Menlo','Monaco','Consolas',monospace",
                      fontSize:12, lineHeight:1.65, resize:"vertical", outline:"none"
                    }}
                  />
                </div>

                {html.trim() && (
                  <button onClick={()=>setTab("preview")} style={{
                    alignSelf:"flex-start", background:"#3a6fb0", color:"white",
                    border:"none", borderRadius:7, padding:"7px 16px",
                    fontSize:13, fontFamily:"inherit", fontWeight:500, cursor:"pointer"
                  }}>Preview →</button>
                )}
              </div>
            ) : (
              <iframe
                key={themeId + showHeader + showFooter + title + date}
                srcDoc={doc}
                title="Preview"
                sandbox="allow-same-origin"
                style={{
                  display:"block", width:"100%", height:"100%",
                  border:"none", margin:0, padding:0, flexShrink:0, flexGrow:1
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width:"100%", background:"#1e2025", border:"1px solid #2e3240",
  borderRadius:6, padding:"5px 9px", fontSize:12.5, color:"#bbb",
  fontFamily:"inherit", outline:"none", display:"block"
};
const labelStyle = { fontSize:10.5, color:"#444", marginBottom:4, display:"block" };

function SideSection({ label, children, last }) {
  return (
    <div style={{padding:"14px 15px 13px", borderBottom: last ? "none" : "1px solid #1e2025"}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#3a4050",marginBottom:9}}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Toggle({ val, set }) {
  return (
    <label style={{position:"relative",display:"inline-block",width:32,height:18,flexShrink:0}}>
      <input type="checkbox" checked={val} onChange={e=>set(e.target.checked)}
        style={{opacity:0,width:0,height:0,position:"absolute"}}/>
      <span style={{position:"absolute",inset:0,borderRadius:18,cursor:"pointer",transition:".2s",
        background: val ? "#3a6fb0" : "#2e3240"}}>
        <span style={{position:"absolute",width:12,height:12,top:3,left: val?17:3,
          background: val?"white":"#555",borderRadius:"50%",transition:".2s"}}/>
      </span>
    </label>
  );
}
