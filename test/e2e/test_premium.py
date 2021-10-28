import time

from selenium.common.exceptions import NoSuchElementException

from framework import TestBase, PremiumPage


class TestPremium(TestBase):
    def setUp(self):
        super(TestPremium, self).setUp()
        self.premium = PremiumPage(self.driver)

    def tearDown(self) -> None:
        self.driver.quit()

    def test_premium_is_not_activated(self):
        self.assertEqual("Your do not have premium enabled", self.premium.premium_availability)
        self.assertEqual("Please activate your premium below", self.premium.expiration_date)
        self.assertTrue(self.premium.license_key_input)
        self.assertTrue(self.premium.activate_button)

    def test_activate_premium(self):
        self.premium.activate_with("6a65ff")
        time.sleep(1)
        self.assertEqual("Your premium is valid until:", self.premium.premium_availability)
        self.assertEqual("2029-02-01", self.premium.expiration_date)
        with self.assertRaises(NoSuchElementException):
            self.premium.license_key_input
        with self.assertRaises(NoSuchElementException):
            self.premium.activate_button

    def test_premium_activated_with_wrong_license_key(self):
        self.premium.activate_with("asdasdas")
        self.assertEqual("License key not found!", self.premium.error)
