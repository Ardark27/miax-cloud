import my_module


def test_suma():
    assert my_module.suma(1, 1) == 2
    assert my_module.suma(2, 2) == 4


def test_resta():
    assert my_module.resta(4, 2) == 2
    assert my_module.resta(2, 2) == 0
