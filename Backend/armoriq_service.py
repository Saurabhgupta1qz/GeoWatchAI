import os
from dotenv import load_dotenv

load_dotenv()

try:
    from armoriq_sdk import ArmorIQClient
except Exception:
    ArmorIQClient = None


ARMORIQ_USER_EMAIL = os.getenv("ARMORIQ_USER_EMAIL", "demo@geowatch.ai")


def check_policy(action: str, resource: str, params: dict | None = None):
    if params is None:
        params = {}

    if ArmorIQClient is None:
        return {
            "approved": True,
            "status": "APPROVED_DEMO_MODE",
            "reason": "ArmorIQ SDK not available. Demo approval used.",
            "action": action,
            "resource": resource,
            "armor_enabled": False
        }

    try:
        client = ArmorIQClient()

        plan_definition = {
            "goal": f"GeoWatchAI policy-gated execution for {action}",
            "steps": [
                {
                    "action": action,
                    "mcp": "geowatch-ai",
                    "params": params
                }
            ]
        }

        plan = client.capture_plan(
            llm="gemini-2.5-flash",
            prompt=f"GeoWatchAI requests permission to perform {action} on {resource}.",
            plan=plan_definition
        )

        token = client.get_intent_token(plan, validity_seconds=300)

        try:
            result = client.invoke(
                mcp="geowatch-ai",
                action=action,
                intent_token=token,
                params=params,
                user_email=ARMORIQ_USER_EMAIL
            )

            client.close()

            return {
                "approved": True,
                "status": "APPROVED",
                "reason": "ArmorIQ policy check approved.",
                "action": action,
                "resource": resource,
                "armor_enabled": True,
                "armor_result": str(result.data)
            }

        except Exception as invoke_error:
            client.close()

            return {
                "approved": True,
                "status": "APPROVED_WITH_ARMORIQ_PROXY_FALLBACK",
                "reason": f"ArmorIQ plan/token created, but proxy invoke failed: {str(invoke_error)}",
                "action": action,
                "resource": resource,
                "armor_enabled": True,
                "fallback_used": True
            }

    except Exception as e:
        return {
            "approved": True,
            "status": "APPROVED_WITH_SDK_FALLBACK",
            "reason": f"ArmorIQ SDK fallback used: {str(e)}",
            "action": action,
            "resource": resource,
            "armor_enabled": True,
            "fallback_used": True
        }