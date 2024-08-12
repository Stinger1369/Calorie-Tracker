import os

ignore = ['venv', '__pycache__', '.git', 'migrations', 'node_modules']

def tree(directory, prefix=''):
    files = os.listdir(directory)
    files = [f for f in files if f not in ignore]
    files.sort()

    for index, file in enumerate(files):
        path = os.path.join(directory, file)
        is_last = index == len(files) - 1

        if os.path.isdir(path):
            print(f"{prefix}{'└─ ' if is_last else '├─ '}{file}")
            tree(path, prefix + ('    ' if is_last else '│   '))
        else:
            print(f"{prefix}{'└─ ' if is_last else '├─ '}{file}")

if __name__ == '__main__':
    tree(os.getcwd())
