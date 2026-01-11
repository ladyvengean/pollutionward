# services/ward_context.py

def build_ward_context(ward_id: str):
    ward = get_ward_data(ward_id)          # AQI, status
    weather = get_weather_data(ward_id)
    sources = get_source_attribution(ward_id)
    trend = get_trend_summary(ward_id)
    city_avg = get_city_average()

    return {
        "ward": ward["name"],
        "aqi": ward["aqi"],
        "status": ward["status"],
        "weather": {
            "windSpeed": weather["wind_speed"],
            "humidity": weather["humidity"]
        },
        "sources": sources,
        "trend": trend,
        "cityAverage": city_avg
    }

def get_trend_summary(ward_id):
    today = get_today_aqi(ward_id)
    yesterday = get_yesterday_aqi(ward_id)

    delta = today - yesterday
    pct = round((delta / yesterday) * 100, 1)

    if delta > 0:
        return f"AQI increased by {pct}% compared to yesterday"
    else:
        return f"AQI decreased by {abs(pct)}% compared to yesterday"

def infer_causes(context):
    causes = []

    if context["sources"]["vehicular"] > 40:
        causes.append("High vehicular emissions during peak hours")

    if context["weather"]["windSpeed"] < 5:
        causes.append("Low wind speed causing pollutant stagnation")

    if context["sources"]["construction"] > 25:
        causes.append("Active construction contributing to dust")

    return causes

def infer_causes(context):
    causes = []

    if context["sources"]["vehicular"] > 40:
        causes.append("High vehicular emissions during peak hours")

    if context["weather"]["windSpeed"] < 5:
        causes.append("Low wind speed causing pollutant stagnation")

    if context["sources"]["construction"] > 25:
        causes.append("Active construction contributing to dust")

    return causes

def build_prompt(context, causes, actions, user_message):
    return f"""
You are an air-quality analyst assistant.

Rules:
- Use ONLY the data provided
- Do NOT invent numbers or causes
- If data is missing, say so clearly

Ward Data:
{context}

Identified Causes:
{causes}

Recommended Actions:
{actions}

User Question:
{user_message}

Explain clearly in simple language.
"""



