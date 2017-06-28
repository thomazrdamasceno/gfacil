package security;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import usersystem.UserSystem;
import java.util.ArrayList;
import java.util.Collection;


/**
 * Created by Chris on 10/19/14.
 */
public class AccountUserDetails  implements UserDetails {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final UserSystem account;

    public UserSystem getAccount() {
		return account;
	}

	public AccountUserDetails(UserSystem account) {
        this.account = account;
    }
    
    public String getDataBase(){
    	
    	return account.getBanco();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        GrantedAuthority authority = new GrantedAuthority() {
            /**
			 * 
			 */
			private static final long serialVersionUID = 1L;

			@Override
            public String getAuthority() {
                return "USER";
            }
        };

        ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(authority);
        return authorities;
    }
    
    
    

    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
