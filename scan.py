#!/usr/bin/env python3
# scan.py - mini-scanner v1
import argparse, json, socket
from datetime import datetime
from tqdm import tqdm
import nmap

def ping_scan(network):
    nm = nmap.PortScanner()
    print(f"[+] Discovering hosts in {network} ...")
    nm.scan(hosts=network, arguments='-sn')
    hosts = []
    for h in nm.all_hosts():
        hosts.append({"ip": h, "state": nm[h].state(), "hostname": nm[h].hostname()})
    return hosts

def port_scan(ip, ports="1-1024"):
    nm = nmap.PortScanner()
    args = f"-sS -sV --open {ports}"
    try:
        nm.scan(ip, ports, arguments=args)
    except Exception as e:
        return {"ip": ip, "error": str(e)}
    result = {"ip": ip, "ports": []}
    if ip not in nm.all_hosts():
        return {"ip": ip, "ports": [], "note": "no-response"}
    for proto in nm[ip].all_protocols():
        for p in sorted(nm[ip][proto].keys()):
            entry = nm[ip][proto][p]
            result["ports"].append({
                "port": p,
                "protocol": proto,
                "state": entry.get("state"),
                "name": entry.get("name"),
                "product": entry.get("product"),
                "version": entry.get("version"),
            })
    return result

def find_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8",80))
        ip = s.getsockname()[0]; s.close()
        return ip
    except:
        return "127.0.0.1"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-n","--network", default=None)
    parser.add_argument("-p","--ports", default="1-1024")
    parser.add_argument("-o","--out", default="scan_results.json")
    args = parser.parse_args()

    if not args.network:
        local = find_local_ip()
        parts = local.split("."); parts[-1] = "0"
        args.network = ".".join(parts) + "/24"
        print(f"[+] Using network: {args.network}")

    start = datetime.utcnow().isoformat() + "Z"
    hosts = ping_scan(args.network)

    results = {"network": args.network, "scanned_at": start, "hosts": []}
    for h in tqdm(hosts):
        if h["state"] != "up":
            results["hosts"].append({"ip": h["ip"], "state": h["state"], "hostname": h.get("hostname"), "ports": []})
            continue
        res = port_scan(h["ip"], ports=args.ports)
        res["hostname"] = h.get("hostname"); res["state"] = h.get("state")
        results["hosts"].append(res)

    with open(args.out,"w") as f:
        json.dump(results, f, indent=2)
    print(f"[+] Results -> {args.out}")

if __name__ == "__main__":
    main()
