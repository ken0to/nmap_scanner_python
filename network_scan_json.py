import json
import subprocess
from datetime import datetime

def scan_host(ip):
    result = subprocess.run(
        ["/opt/homebrew/bin/nmap", "-sT", "-p", "1-200", "-T4", "-oG", "-", ip],
        capture_output=True, text=True
    )
    lines = result.stdout.splitlines()
    open_ports = []
    for line in lines:
        if "/open/" in line:
            parts = line.split()
            for part in parts:
                if "/open/" in part:
                    port = part.split("/")[0]
                    open_ports.append(int(port))
    return {"ip": ip, "open_ports": open_ports}

def main():
    with open("alive_ips.txt") as f:
        hosts = [line.strip() for line in f if line.strip()]

    results = []
    for ip in hosts:
        print(f"Scanning {ip} ...")
        results.append(scan_host(ip))

    data = {
        "scanned_at": datetime.utcnow().isoformat() + "Z",
        "hosts": results
    }

    with open("scan_results.json", "w") as f:
        json.dump(data, f, indent=2)
    print("\nResults saved to scan_results.json")

if __name__ == "__main__":
    main()
