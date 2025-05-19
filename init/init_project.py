import os
import subprocess
import sys
import venv
from pathlib import Path

from config_loader import load_config, create_env_content

def run_command(command):
    """실행할 명령어를 운영체제에 맞게 실행합니다."""
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"명령어 실행 중 오류 발생: {e}")
        sys.exit(1)

def create_env_file():
    """환경 변수 파일을 생성합니다."""
    env_content = create_env_content()
    project_root = Path(__file__).parent.parent
    
    with open(project_root / '.env', 'w', encoding='utf-8') as f:
        f.write(env_content)
    print("✨ .env 파일이 생성되었습니다. DB 접속 정보를 수정해주세요!")

def init_project():
    """프로젝트를 초기화합니다."""
    print("🚀 Money Check 프로젝트 초기화를 시작합니다...")
    
    # 설정 로드
    config = load_config()
    project_root = Path(__file__).parent.parent
    
    # 현재 디렉토리 확인
    if project_root.name != "Money_check_project":
        print("❌ Money_check_project 디렉토리에서 실행해주세요!")
        return

    # 가상환경 생성
    print("1️⃣ 가상환경을 생성합니다...")
    venv_path = project_root / config['paths']['venv']
    venv.create(venv_path, with_pip=True)
    
    # 운영체제에 따른 가상환경 활성화 명령어와 경로
    if sys.platform == "win32":
        activate_cmd = str(venv_path / "Scripts" / "activate.bat")
        python_cmd = str(venv_path / "Scripts" / "python.exe")
        pip_cmd = str(venv_path / "Scripts" / "pip.exe")
    else:
        activate_cmd = f"source {venv_path}/bin/activate"
        python_cmd = str(venv_path / "bin" / "python")
        pip_cmd = str(venv_path / "bin" / "pip")

    # 패키지 설치 (Windows용 명령어)
    print("2️⃣ 필요한 패키지를 설치합니다...")
    if sys.platform == "win32":
        install_cmd = f'cmd /c "{activate_cmd} && "{pip_cmd}" install -r "{project_root / config["paths"]["requirements"]}"'
    else:
        install_cmd = f'bash -c "{activate_cmd} && {pip_cmd} install -r {project_root / config["paths"]["requirements"]}"'
    run_command(install_cmd)

    # Django 프로젝트 생성
    backend_path = project_root / config['paths']['backend']
    if not backend_path.exists():
        print("3️⃣ Django 프로젝트를 생성합니다...")
        os.chdir(project_root)  # 프로젝트 루트로 이동
        if sys.platform == "win32":
            django_cmd = f'cmd /c "{activate_cmd} && django-admin startproject backend ."'
        else:
            django_cmd = f'bash -c "{activate_cmd} && django-admin startproject backend ."'
        run_command(django_cmd)
        
    # .env 파일 생성
    env_path = project_root / '.env'
    if not env_path.exists():
        print("4️⃣ 환경 설정 파일을 생성합니다...")
        create_env_file()

    print("""
✅ 초기화가 완료되었습니다!

다음 단계를 진행해주세요:
1. init/config.yaml 파일에서 DB 접속 정보를 수정해주세요
2. 가상환경을 활성화하세요:
   - Windows: .\\venv\\Scripts\\activate
   - Mac/Linux: source venv/bin/activate
3. Django 마이그레이션을 실행하세요:
   python manage.py migrate

문제가 있다면 README.md를 참고해주세요!
""")

if __name__ == "__main__":
    init_project() 