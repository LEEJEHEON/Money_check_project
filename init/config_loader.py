import os
import yaml
from pathlib import Path

def load_config():
    """YAML 설정 파일을 로드합니다."""
    config_path = Path(__file__).parent / 'config.yaml'
    
    if not config_path.exists():
        raise FileNotFoundError(f"설정 파일을 찾을 수 없습니다: {config_path}")
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)
    
    return config

def get_db_url():
    """데이터베이스 URL을 생성합니다."""
    config = load_config()
    db = config['database']
    return f"postgresql://{db['user']}:{db['password']}@{db['host']}:{db['port']}/{db['name']}"

def create_env_content():
    """환경 변수 파일 내용을 생성합니다."""
    config = load_config()
    db = config['database']
    django = config['django']
    
    env_content = f"""DEBUG={str(django['debug']).upper()}
DB_NAME={db['name']}
DB_USER={db['user']}
DB_PASSWORD={db['password']}
DB_HOST={db['host']}
DB_PORT={db['port']}
ALLOWED_HOSTS={','.join(django['allowed_hosts'])}
CORS_ALLOWED_ORIGINS={','.join(django['cors_origins'])}
"""
    return env_content 