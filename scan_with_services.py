#!/usr/bin/env python3
import json, subprocess
from datetime import datetime

NM = "/opt/homebrew/bin/nmap"   # path to homebrew nmap; change if necessary

def scan_host(ip):
    cmd = [NM, "-sT", "-sV", "-T4", "-p", "1-200", "-oG", "-", ip]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    out = proc.stdout.splitlines()
    ports = []
    hostname = None
    for line in out:
        if line.startswith("Host:"):
            parts = line.split()
            if len(parts) >= 3:
                hn = parts[2].strip()
                if hn != "()":
                    hostname = hn
        if "/open/" in line:
            for seg in line.split():
                if "/open/" in seg:
                    try:
                        port = int(seg.split("/")[0])
                    except:
                        continue
                    svc = ""
                    if "# " in line:
                        svc = line.split("# ",1)[1].strip()
                    ports.append({"port": port, "service": svc})
    return {"ip": ip, "hostname": hostname, "open_ports": ports}

def main():
    try:
        with open("alive_ips.txt") as f:
            hosts = [l.strip() for l in f if l.strip()]
    except FileNotFoundError:
        print("alive_ips.txt not found. Create it with one IP per line.")
        return

    results = []
    for ip in hosts:
        print(f"Scanning {ip} ...")
        results.append(scan_host(ip))

    out = {
        "scanned_at": datetime.utcnow().isoformat()+"Z",
        "hosts": results
    }
    with open("scan_results.json","w") as fh:
        json.dump(out, fh, indent=2)
    print("Saved -> scan_results.json")

if __name__ == '__main__':
    main()
