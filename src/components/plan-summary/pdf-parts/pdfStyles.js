export const getPdfStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
    body {
      font-family: 'Cairo', sans-serif;
      direction: rtl;
      line-height: 1.6;
      color: #000000;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    }
    .page {
      padding: 15mm;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      width: 297mm;
      height: 210mm;
      box-sizing: border-box;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .page-content-overlay {
      background-color: transparent;
      padding: 15mm;
      border-radius: 8px;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .title-page-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
    }
    h1, h2, h3 {
      color: #000000;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 0.5em;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    }
    h1 { font-size: 28pt; }
    h2 { font-size: 20pt; border-bottom: 2px solid rgba(0,0,0,0.2); padding-bottom: 5px; margin-top: 20px; }
    h3 { font-size: 16pt; }
    p, li, td, th { font-size: 12pt; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 10pt;
      background-color: rgba(255,255,255,0.4);
      border-radius: 8px;
    }
    th, td {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 8px;
      text-align: right;
    }
    th {
      background-color: rgba(0,0,0,0.1);
      font-weight: 700;
    }
    ul, ol {
      padding-right: 20px;
      list-style-position: inside;
    }
  </style>
`;