#!/usr/bin/env python3
"""
Test script to verify YouTube Analytics Dashboard deployment on Render.
"""
import requests
import json
import sys
from typing import Dict, Any

# Deployment URLs (update these after deployment)
BACKEND_URL = "https://youtube-analytics-backend.onrender.com"
FRONTEND_URL = "https://youtube-analytics-frontend.onrender.com"

def test_endpoint(url: str, endpoint: str, method: str = "GET", data: Dict = None) -> Dict[str, Any]:
    """Test an API endpoint and return the result."""
    full_url = f"{url}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(full_url, timeout=30)
        elif method == "POST":
            response = requests.post(full_url, json=data, timeout=30)
        
        return {
            "url": full_url,
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
        }
    except Exception as e:
        return {
            "url": full_url,
            "status_code": None,
            "success": False,
            "error": str(e)
        }

def main():
    """Run deployment tests."""
    print("🚀 Testing YouTube Analytics Dashboard Deployment")
    print("=" * 60)
    
    tests = [
        # Backend API tests
        ("Backend Health Check", BACKEND_URL, "/health"),
        ("Backend Root", BACKEND_URL, "/"),
        ("API Documentation", BACKEND_URL, "/docs"),
        ("UTM Links API", BACKEND_URL, "/api/v1/utm-links"),
        
        # Frontend tests
        ("Frontend Home", FRONTEND_URL, "/"),
        ("Frontend Traffic Page", FRONTEND_URL, "/traffic"),
    ]
    
    results = []
    
    for test_name, base_url, endpoint in tests:
        print(f"\n🧪 Testing: {test_name}")
        result = test_endpoint(base_url, endpoint)
        results.append((test_name, result))
        
        if result["success"]:
            print(f"   ✅ SUCCESS - Status: {result['status_code']}")
        else:
            print(f"   ❌ FAILED - Status: {result.get('status_code', 'N/A')}")
            if "error" in result:
                print(f"   Error: {result['error']}")
    
    # Test UTM link creation
    print(f"\n🧪 Testing: UTM Link Creation")
    utm_data = {
        "video_id": "DEPLOY_TEST",
        "destination_url": "https://example.com/test-deployment",
        "utm_content": "deployment_test"
    }
    
    create_result = test_endpoint(BACKEND_URL, "/api/v1/utm-links", "POST", utm_data)
    results.append(("UTM Link Creation", create_result))
    
    if create_result["success"]:
        print(f"   ✅ SUCCESS - UTM Link Created")
        
        # Test pretty URL redirect if creation was successful
        if "response" in create_result and isinstance(create_result["response"], dict):
            pretty_slug = create_result["response"].get("pretty_slug")
            if pretty_slug:
                print(f"\n🧪 Testing: Pretty URL Redirect")
                redirect_result = test_endpoint(BACKEND_URL, f"/api/v1/go/{pretty_slug}")
                results.append(("Pretty URL Redirect", redirect_result))
                
                if redirect_result["success"]:
                    print(f"   ✅ SUCCESS - Pretty URL works: /api/v1/go/{pretty_slug}")
                else:
                    print(f"   ❌ FAILED - Pretty URL redirect failed")
    else:
        print(f"   ❌ FAILED - UTM Link Creation failed")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DEPLOYMENT TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result["success"])
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Deployment is successful!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the deployment configuration.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
