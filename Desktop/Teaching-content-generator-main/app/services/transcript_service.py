from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    parsed = urlparse(url)
    return parse_qs(parsed.query).get("v", [None])[0]

def fetch_transcript(yt_link):
    video_id = extract_video_id(yt_link)
    if not video_id:
        raise ValueError("Invalid YouTube URL")
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    return " ".join([x['text'] for x in transcript])
