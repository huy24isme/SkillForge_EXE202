import { jsPDF } from 'jspdf';

type MemberSummary = {
  name: string;
  summary: string;
  reportsSubmitted?: string;
};

type MemberEvaluation = {
  performingWell?: string[];
  overloaded?: string[];
  lateReports?: string[];
};

export type WeeklyReportPdfData = {
  projectName: string;
  weekRange: string;
  summary?: string;
  progressSummary?: string[];
  members?: MemberSummary[];
  projectStatusLabel?: string;
  projectReason?: string;
  memberEvaluation?: MemberEvaluation;
  recommendations?: string[];
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toAscii(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function safeFileName(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// function renderList(items: string[]) {
//   if (!items.length) {
//     return '<p style="margin: 0;">N/A.</p>';
//   }

//   return `<ul style="margin: 0; padding-left: 18px;">${items
//     .map((item) => `<li style="margin: 0 0 6px;">${escapeHtml(toAscii(item))}</li>`)
//     .join('')}</ul>`;
// }

function buildReportHtml(data: WeeklyReportPdfData) {
  const members = data.members ?? [];
  const progressSummary = data.progressSummary ?? [];
  const recommendations = data.recommendations ?? [];
  const evaluation = data.memberEvaluation ?? {};

  const list = (items: string[]) =>
    items.length
      ? `<ul style="margin:0;padding-left:16px;">
          ${items
            .map(
              (i) =>
                `<li style="margin-bottom:4px;">${escapeHtml(
                  toAscii(i)
                )}</li>`
            )
            .join("")}
        </ul>`
      : `<p style="margin:0;">N/A</p>`;

  const memberRows = members.length
    ? members
        .map(
          (m) => `
<tr>
<td>${escapeHtml(toAscii(m.name))}</td>
<td>${escapeHtml(toAscii(m.summary))}</td>
<td>${escapeHtml(toAscii(m.reportsSubmitted ?? "-"))}</td>
</tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="text-align:center;">No data</td></tr>`;

  return `
<div style="
width:680px;
font-family: Helvetica, Arial, sans-serif;
font-size:10px;
line-height:1.5;
color:#111;
background:#fff;
padding:18px;
box-sizing:border-box;
word-break:break-word;
overflow-wrap:anywhere;
">

<!-- HEADER -->
<div style="border-bottom:2px solid #1f2937;padding-bottom:10px;margin-bottom:14px;">
<div style="font-size:16px;font-weight:700;">SkillForge Project Report</div>
<div style="font-size:11px;color:#555;">Weekly Performance Report</div>
</div>

<!-- PROJECT META -->
<table style="
width:100%;
border-collapse:collapse;
margin-bottom:16px;
table-layout:fixed;
">
<tr>
<td style="border:1px solid #ccc;padding:6px;width:120px;font-weight:600;">Project</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
    toAscii(data.projectName)
  )}</td>
</tr>

<tr>
<td style="border:1px solid #ccc;padding:6px;font-weight:600;">Week</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
    toAscii(data.weekRange)
  )}</td>
</tr>

${
  data.projectStatusLabel
    ? `
<tr>
<td style="border:1px solid #ccc;padding:6px;font-weight:600;">Status</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
        toAscii(data.projectStatusLabel)
      )}</td>
</tr>`
    : ""
}
</table>

${
  data.summary
    ? `
<!-- SECTION 1 -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:4px;">1. Executive Summary</div>
<p style="margin:0;">${escapeHtml(toAscii(data.summary))}</p>
</div>
`
    : ""
}

${
  progressSummary.length
    ? `
<!-- SECTION 2 -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:4px;">2. Weekly Progress</div>
${list(progressSummary)}
</div>
`
    : ""
}

${
  data.projectReason
    ? `
<!-- SECTION 3 -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:4px;">3. Project Evaluation</div>
<p style="margin:0;">${escapeHtml(toAscii(data.projectReason))}</p>
</div>
`
    : ""
}

<!-- SECTION 4 TEAM -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:6px;">4. Team Contributions</div>

<table style="
width:100%;
border-collapse:collapse;
table-layout:fixed;
">

<thead>
<tr style="background:#f3f4f6;">
<th style="border:1px solid #ccc;padding:6px;width:150px;text-align:left;">Member</th>
<th style="border:1px solid #ccc;padding:6px;text-align:left;">Contribution</th>
<th style="border:1px solid #ccc;padding:6px;width:110px;text-align:left;">Reports</th>
</tr>
</thead>

<tbody>
${memberRows}
</tbody>

</table>
</div>

<!-- SECTION 5 -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:6px;">5. Member Evaluation</div>

<table style="
width:100%;
border-collapse:collapse;
table-layout:fixed;
">

<tr>
<td style="border:1px solid #ccc;padding:6px;width:160px;font-weight:600;">Top Performers</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
    toAscii((evaluation.performingWell ?? []).join(", ") || "N/A")
  )}</td>
</tr>

<tr>
<td style="border:1px solid #ccc;padding:6px;font-weight:600;">Overloaded</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
    toAscii((evaluation.overloaded ?? []).join(", ") || "N/A")
  )}</td>
</tr>

<tr>
<td style="border:1px solid #ccc;padding:6px;font-weight:600;">Late Reports</td>
<td style="border:1px solid #ccc;padding:6px;">${escapeHtml(
    toAscii((evaluation.lateReports ?? []).join(", ") || "N/A")
  )}</td>
</tr>

</table>
</div>

${
  recommendations.length
    ? `
<!-- SECTION 6 -->
<div style="margin-bottom:14px;">
<div style="font-weight:700;margin-bottom:4px;">6. Recommendations</div>
${list(recommendations)}
</div>
`
    : ""
}

<!-- FOOTER -->
<div style="
margin-top:18px;
border-top:1px solid #ddd;
padding-top:6px;
font-size:9px;
color:#666;
">

Generated by SkillForge System<br>
${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString(
    "en-GB"
  )}

</div>

</div>
`;
}

export async function downloadWeeklyReportPdf(data: WeeklyReportPdfData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.background = '#ffffff';
  wrapper.style.width = '700px';
  wrapper.style.opacity = '1';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '-1';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = buildReportHtml(data);
  document.body.appendChild(wrapper);

  try {
    await doc.html(wrapper, {
      margin: [12, 12, 12, 12],
      autoPaging: 'text',
      html2canvas: {
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Avoid parsing Tailwind v4 OKLCH rules from global stylesheets.
          clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
        },
      },
      width: 180,
      windowWidth: 700,
    });

    const fileName = `bao-cao-tuan-${safeFileName(data.projectName)}-${safeFileName(data.weekRange)}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Khong the xuat PDF luc nay. Vui long thu lai.');
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }

    // Defensive cleanup if html2canvas left temporary containers in DOM.
    document.querySelectorAll('.html2canvas-container').forEach((node) => node.remove());
  }
}
