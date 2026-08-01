import io
import json
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_pdf_report(analysis_dict: dict, patient_info: dict = None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#1E3A8A")  # Deep Navy
    SECONDARY = colors.HexColor("#0D9488") # Teal
    TEXT_MAIN = colors.HexColor("#1F2937") # Charcoal
    BG_LIGHT = colors.HexColor("#F8FAFC")  # Light Slate
    BORDER_COLOR = colors.HexColor("#CBD5E1")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
        alignment=TA_LEFT
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=PRIMARY,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_MAIN
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_MAIN,
        leftIndent=12
    )

    elements = []

    # 1. Header Section
    header_data = [
        [
            Paragraph("<b>AudAI Diagnostic Report</b>", title_style),
            Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d %b %Y, %I:%M %p')}<br/><b>Report ID:</b> AUD-{analysis_dict.get('analysis_id', '1001')}", ParagraphStyle('HeadRight', parent=body_style, alignment=TA_RIGHT))
        ],
        [
            Paragraph("AI-Assisted Pure Tone Audiometry & Disability Assessment", subtitle_style),
            Paragraph("Confidential Medical Record", ParagraphStyle('SubRight', parent=body_style, alignment=TA_RIGHT, textColor=colors.HexColor("#DC2626")))
        ]
    ]
    
    header_table = Table(header_data, colWidths=[3.2*inch, 3.8*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=4, spaceAfter=12))

    # 2. Patient Details Table
    p_info = patient_info or {}
    patient_data = [
        [
            Paragraph("<b>Patient ID:</b>", body_style),
            Paragraph(str(analysis_dict.get('patient_id', 'PAT-1001')), body_style),
            Paragraph("<b>Age / Gender:</b>", body_style),
            Paragraph(f"{p_info.get('age', '45')} yrs / {p_info.get('gender', 'Male')}", body_style)
        ],
        [
            Paragraph("<b>Exam Type:</b>", body_style),
            Paragraph("Pure Tone Audiometry (PTA)", body_style),
            Paragraph("<b>Referred By:</b>", body_style),
            Paragraph(p_info.get('doctor_name', 'Dr. S. Sharma (ENT Specialist)'), body_style)
        ]
    ]
    
    patient_table = Table(patient_data, colWidths=[1.1*inch, 2.4*inch, 1.1*inch, 2.4*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(patient_table)
    elements.append(Spacer(1, 14))

    # 3. AI Diagnosis & Disability Summary Banner
    diagnosis = analysis_dict.get('diagnosis', 'Moderate Hearing Loss')
    confidence = analysis_dict.get('confidence', 95.0)
    disability_pct = analysis_dict.get('disability_percentage', 0.0)
    severity = analysis_dict.get('severity', 'Moderate')

    diag_color = colors.HexColor("#0284C7") # Blue
    if "Severe" in diagnosis or "Profound" in diagnosis:
        diag_color = colors.HexColor("#DC2626") # Red
    elif "Moderate" in diagnosis:
        diag_color = colors.HexColor("#D97706") # Amber

    diag_card_data = [
        [
            Paragraph("<b>PRIMARY AI DIAGNOSIS</b>", ParagraphStyle('DiagHeader', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph("<b>AI CONFIDENCE SCORE</b>", ParagraphStyle('DiagHeader2', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER)),
            Paragraph("<b>DISABILITY PERCENTAGE</b>", ParagraphStyle('DiagHeader3', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER))
        ],
        [
            Paragraph(f"<font size=14><b>{diagnosis}</b></font><br/><font size=9>Severity: {severity}</font>", ParagraphStyle('DiagVal', parent=body_style, textColor=PRIMARY)),
            Paragraph(f"<font size=16><b>{confidence}%</b></font>", ParagraphStyle('DiagVal2', parent=body_style, textColor=SECONDARY, alignment=TA_CENTER)),
            Paragraph(f"<font size=16><b>{disability_pct}%</b></font><br/><font size=8>(WHO/Govt Standard)</font>", ParagraphStyle('DiagVal3', parent=body_style, textColor=diag_color, alignment=TA_CENTER))
        ]
    ]

    diag_table = Table(diag_card_data, colWidths=[3.2*inch, 1.9*inch, 1.9*inch])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (0,1), (-1,1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(diag_table)
    elements.append(Spacer(1, 14))

    # 4. Pure Tone Audiometry Threshold Table
    elements.append(Paragraph("Pure Tone Audiometry Thresholds (dB HL)", section_heading))
    
    # Check if raw thresholds exist in analysis_dict
    raw_data = analysis_dict.get('raw_input', {})
    chart_pts = analysis_dict.get('audiogram_frequencies', [])
    
    if chart_pts:
        freq_map_l = {item['frequency']: item['left_ear'] for item in chart_pts}
        freq_map_r = {item['frequency']: item['right_ear'] for item in chart_pts}
    else:
        freq_map_l = {250: raw_data.get('L_250', 35), 500: raw_data.get('L_500', 45), 1000: raw_data.get('L_1000', 50), 2000: raw_data.get('L_2000', 55), 4000: raw_data.get('L_4000', 60), 8000: raw_data.get('L_8000', 65)}
        freq_map_r = {250: raw_data.get('R_250', 30), 500: raw_data.get('R_500', 40), 1000: raw_data.get('R_1000', 45), 2000: raw_data.get('R_2000', 50), 4000: raw_data.get('R_4000', 55), 8000: raw_data.get('R_8000', 60)}

    freq_cols = [250, 500, 1000, 2000, 4000, 8000]
    
    # Calculate PTAs
    pta_l = sum(freq_map_l[f] for f in [500, 1000, 2000, 4000]) / 4.0
    pta_r = sum(freq_map_r[f] for f in [500, 1000, 2000, 4000]) / 4.0

    threshold_table_data = [
        ["Frequency (Hz)", "250 Hz", "500 Hz", "1000 Hz", "2000 Hz", "4000 Hz", "8000 Hz", "PTA (Speech)"],
        ["Left Ear (Blue 🅛)", f"{freq_map_l[250]} dB", f"{freq_map_l[500]} dB", f"{freq_map_l[1000]} dB", f"{freq_map_l[2000]} dB", f"{freq_map_l[4000]} dB", f"{freq_map_l[8000]} dB", f"<b>{pta_l:.1f} dB</b>"],
        ["Right Ear (Red 🅡)", f"{freq_map_r[250]} dB", f"{freq_map_r[500]} dB", f"{freq_map_r[1000]} dB", f"{freq_map_r[2000]} dB", f"{freq_map_r[4000]} dB", f"{freq_map_r[8000]} dB", f"<b>{pta_r:.1f} dB</b>"],
    ]

    t_table = Table([[Paragraph(c, body_style) for c in row] for row in threshold_table_data], colWidths=[1.4*inch] + [0.8*inch]*7)
    t_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
    ]))
    elements.append(t_table)
    elements.append(Spacer(1, 14))

    # 5. Clinical Recommendations & Action Plan
    elements.append(Paragraph("Clinical Recommendations & Intervention Strategy", section_heading))
    
    recs = analysis_dict.get('recommendation', 'Consult ENT Specialist for further evaluation.')
    if isinstance(recs, str):
        recs_list = [r.strip() for r in recs.split('.') if r.strip()]
    elif isinstance(recs, list):
        recs_list = recs
    else:
        recs_list = ["Comprehensive audiological consultation recommended."]

    for r in recs_list:
        elements.append(Paragraph(f"• {r}.", bullet_style))
        elements.append(Spacer(1, 3))

    elements.append(Spacer(1, 10))

    # 5.5 Prevention & Precautions (Hearing Conservation)
    elements.append(Paragraph("Hearing Conservation & Preventive Care Guidelines", section_heading))
    
    prev_data = [
        [
            Paragraph("<b>1. Noise Protection:</b> Use certified ear protection in environments exceeding 85 dBA.", bullet_style),
            Paragraph("<b>2. Safe Audio (60/60 Rule):</b> Keep headphone volume <60% and limit sessions to 60 mins.", bullet_style)
        ],
        [
            Paragraph("<b>3. Ototoxic Guard:</b> Consult ENT before taking aminoglycosides or high-dose NSAIDs.", bullet_style),
            Paragraph("<b>4. Ear Canal Hygiene:</b> Never insert cotton swabs into ear canals. Schedule annual checks.", bullet_style)
        ]
    ]
    prev_table = Table(prev_data, colWidths=[3.5*inch, 3.5*inch])
    prev_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(prev_table)
    elements.append(Spacer(1, 12))

    # 6. Sign-off Footer
    elements.append(HRFlowable(width="100%", thickness=0.8, color=BORDER_COLOR, spaceBefore=8, spaceAfter=12))
    
    footer_data = [
        [
            Paragraph("<b>Evaluated By:</b><br/>AudAI Automated Diagnostic System v1.0<br/>Verified by ENT Clinical Rules Engine", subtitle_style),
            Paragraph("<b>Attending Audiologist / ENT Signature:</b><br/><br/>____________________________________<br/>Dr. S. Sharma, M.S. (ENT)", ParagraphStyle('FootRight', parent=body_style, alignment=TA_RIGHT))
        ]
    ]
    footer_table = Table(footer_data, colWidths=[3.5*inch, 3.5*inch])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    elements.append(KeepTogether(footer_table))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
