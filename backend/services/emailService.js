import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, summaryData }) {
    if (!Array.isArray(summaryData)) {
      console.error("[EmailService] Invalid summary data:", summaryData);
      return;
    }
  
    const rows = summaryData.map(row => `
      <tr>
        <td>${row.Ward}</td>
        <td>${row.AQI}</td>
        <td>${row.Category}</td>
        <td>${row.Priority}</td>
      </tr>
    `).join("");
  
    const html = `
      <h2>Delhi Pollution – Daily Ward Summary</h2>
      <table border="1" cellpadding="6">
        <tr>
          <th>Ward</th>
          <th>AQI</th>
          <th>Category</th>
          <th>Priority</th>
        </tr>
        ${rows}
      </table>
    `;
  
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html
    });
  
    console.log("📧 Daily summary email sent to", to);
  }
  

  //console.log("📧 Email sent via Resend:", response);

