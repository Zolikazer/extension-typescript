from framework import TestBase, SettingsPage


class TestSettings(TestBase):
    def setUp(self):
        super().setUp()
        self.settings = SettingsPage(self.driver)

    def test_default_settings(self):
        self.assertTrue(self.settings.warn_checked)

    def test_toggle_warn_checked(self):
        self.settings.toggle_warn()
        self.assertEqual(False, self.settings.warn_checked)

    def test_money_earned_can_be_saved(self):
        self.settings.set_payrate(10)

        self.assertEqual(10, self.settings.payrate)
